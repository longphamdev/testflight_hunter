import axios from 'axios';
import * as cheerio from 'cheerio';
import { config } from 'dotenv';
config();

import sendMessage from "./telegram_bot.js";
import { server } from "./utils.js";

const CHAT_ID = process.env.CHAT_ID;
const BOT_WATCHER_TOKEN = process.env.BOT_WATCHER_TOKEN;
const BOT_UPTIME_TRACKER_TOKEN = process.env.BOT_UPTIME_TRACKER_TOKEN;
const XPATH_STATUS = '.beta-status span';
const TESTFLIGHT_URL = 'https://testflight.apple.com/join/';
const FULL_TEXT = 'This beta is full.';
const NOT_OPEN_TEXT = "This beta isn't accepting any new testers right now.";
const ID_LIST = process.env.ID_LIST.split(',');
const SLEEP_TIME = process.env.INTERVAL_CHECK;
const TITLE_REGEX = /Join the (.+) beta - TestFlight - Apple/;

function main(watchIds, sendMessage, sleepTime = 10000,uptimeTrack) {
  
  // start server
  server();

  // send message to uptime tracker bot
  if(uptimeTrack)
  setInterval(async () => {
    await sendMessage("Bot is alive", CHAT_ID, BOT_UPTIME_TRACKER_TOKEN);
  },sleepTime);

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
            console.log(response.status, ` - ${tfId} - Not Found.`)
            continue;
          }

          const $ = cheerio.load(response.data);
          const statusText = $(XPATH_STATUS).text().trim();
          const fullSlot = statusText === FULL_TEXT;
          const notOpen = statusText === NOT_OPEN_TEXT;

          // case: not open
          if (notOpen) {
            console.log(response.status, ` - ${tfId} - ${statusText}`)
            continue;
          }

          const title = $('title').text();
          const titleMatch = title.match(TITLE_REGEX);
          // case: slot full
          if(fullSlot){
            console.log(response.status, ` - ${tfId} - ${titleMatch[1]} - ${statusText}`)
            continue;
          }
          // case: slot available
          const tfLink = `${TESTFLIGHT_URL + tfId}`
          await sendMessage(tfLink, CHAT_ID, BOT_WATCHER_TOKEN);
          console.log(response.status, ` - ${tfId} - ${titleMatch[1]} - ${statusText}`)
        } catch (error) {
          console.log(error.response.status, ` - ${tfId} - Invalid ID`)
          //console.error("watch function: ", error);
        }
      }
    }
    watcher();
  }, sleepTime);
}

main(ID_LIST, sendMessage, SLEEP_TIME,true);