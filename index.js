import axios from 'axios';
import * as cheerio from 'cheerio';
import  constant from './constant.js';
import sendMessage from "./telegram_bot.js";
import { server } from "./utils.js";

const {
  CHAT_ID,
  BOT_WATCHER_TOKEN,
  BOT_UPTIME_TRACKER_TOKEN,
  ID_LIST,
  SLEEP_TIME,
  ENABLE_UPTIME_TRACKER,
  PORT,
  // =============
  XPATH_STATUS,
  TESTFLIGHT_URL,
  FULL_TEXT,
  NOT_OPEN_TEXT,
  TITLE_REGEX,
} = constant;

function main(watchIds, sendMessage, sleepTime = 10000,uptimeTrack) {
 
  // check if env variable is not set, return
  if(!(CHAT_ID && BOT_UPTIME_TRACKER_TOKEN && PORT))
  {
    console.log("Please check CHAT_ID, BOT_UPTIME_TRACKER_TOKEN, PORT in .env file");
    return;
  }

  // start server
  console.log(`Server is running on port: ${PORT}`);
  server(CHAT_ID, BOT_UPTIME_TRACKER_TOKEN,PORT);

  // start watcher
  setInterval(async () => {
    const watcher = async () => {
      for (const tfId of watchIds) {
        try {
          const response = await axios.get(TESTFLIGHT_URL + tfId, {
            headers: { 'Accept-Language': 'en-us' }
          });

  
          if (!response.data)
          {
            console.log(response.status, ` - ${tfId} - Invalid TestFlight ID`)
            // send to uptime tracker bot
            if(uptimeTrack)
              await sendMessage(`${response.status} - ${tfId} - Invalid TestFlight ID`, CHAT_ID, BOT_UPTIME_TRACKER_TOKEN);
            continue;
          }
          const $ = cheerio.load(response.data);
          const statusText = $(XPATH_STATUS).text().trim();
          const fullSlot = statusText === FULL_TEXT;
          const notOpen = statusText === NOT_OPEN_TEXT;

        
          // case: not open
          if (notOpen) {
            console.log(response.status, ` - ${tfId} - ${statusText}`)
            // send to uptime tracker bot
            if(uptimeTrack)
              await sendMessage(`${response.status} - ${tfId} - ${statusText}`, CHAT_ID, BOT_UPTIME_TRACKER_TOKEN);
            continue;
          }

          const title = $('title').text();
          const titleMatch = title.match(TITLE_REGEX);

          // case: slot full
          if(fullSlot){
            console.log(response.status, ` - ${tfId} - ${titleMatch[1]} - ${statusText}`)
            // send to uptime tracker bot
            if(uptimeTrack)
              await sendMessage(`${response.status} - ${tfId} - ${titleMatch[1]} - ${statusText}`, CHAT_ID, BOT_UPTIME_TRACKER_TOKEN);
            continue;
          }
          // case: slot available
          const tfLink = `${TESTFLIGHT_URL + tfId}`
          await sendMessage(tfLink, CHAT_ID, BOT_WATCHER_TOKEN);
          console.log(response.status, ` - ${tfId} - ${titleMatch[1]} - ${statusText}`)
          // send to uptime tracker bot
          if(uptimeTrack)
            await sendMessage(`${response.status} - ${tfId} - ${titleMatch[1]} - ${statusText}`, CHAT_ID, BOT_UPTIME_TRACKER_TOKEN);
        } catch (error) {
            if(error.response&&error.response.status===404)
            {
              console.log(error.response.status, ` - ${tfId} - Invalid TestFlight ID`)
              // send to uptime tracker bot
              if(uptimeTrack)
                await sendMessage(`${error.response.status} - ${tfId} - Invalid TestFlight ID`, CHAT_ID, BOT_UPTIME_TRACKER_TOKEN);
              continue;
            }

            console.log(error, ` - ${tfId}`)
            // send to uptime tracker bot
            if(uptimeTrack)
              await sendMessage(`${error} - ${tfId}`, CHAT_ID, BOT_UPTIME_TRACKER_TOKEN);
          
        }
      }
    }
    watcher();
  }, sleepTime);
}

main(ID_LIST, sendMessage, SLEEP_TIME,ENABLE_UPTIME_TRACKER);