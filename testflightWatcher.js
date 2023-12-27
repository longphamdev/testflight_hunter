import axios from 'axios';
import { config } from 'dotenv';
config();
import { readFile } from 'fs/promises';

import botCustom from './botCustom.js';
import constant from './constant.js';
import utils from './utils.js';
import state from './state.js';
import telegramCommand from './telegramCommand.js';

function watch(sendNotification, INTERVAL_CHECK = 10000) {

  // watchIdSent is used to keep track of the watchIds that have been sent to the bot
  const watchIdSent = [];

  setTimeout(() => {
    watchIdSent.length = 0;
    console.log('watchIdSent list has been reset.');
  }, 24 * 60 * 60 * 1000); // Reset the list in 1 day (24 hours * 60 minutes * 60 seconds * 1000 milliseconds)
  
  // start the watcher
  setInterval(async () => {
    if (state.isReadingFile) {
      return;
    }
    state.isReadingFile= true;
    const data = await readFile('./tf_list.json');
    const tfList=JSON.parse(data).ID_LIST;
    state.isReadingFile = false;
    const watcher = async () => {
      for (const tfId of tfList) {
        try {
          const tfLink = `${constant.TEST_FLIGHT_URL + tfId}`

          const response = await axios.get(tfLink, {
            headers: { 'Accept-Language': 'en-us' }
          });
          const {isAvailableSlot,isFullSlot,isNotOpen} = utils.getStatus(response.data);

          // case 1: Open for testing, slot available
          if(isAvailableSlot && !watchIdSent.includes(tfId))
          {
            await sendNotification(tfLink,constant.CHAT_ID,constant.TOPIC_ID);
            // add the tfId to the watchIdSent
            watchIdSent.push(tfId);
            console.log(response.status,` - ${tfId} - Slot available`)
          }
          
          // case 2: Open for testing, slot full
          if (isFullSlot) {
            console.log(response.status,` - ${tfId} - Full slot`)
          }

          // case 3: Not open for testing
          if (isNotOpen) {
            console.log(response.status,` - ${tfId} - Not open for testing`)
          }
        } catch (error) {
          // case 4: Invalid ID or Removed
          console.log(error.response.status, ` - ${tfId} - Invalid ID or Removed`)
        }
      }
    }
    watcher();

  }, INTERVAL_CHECK);
}

watch(botCustom.sendTopic, constant.INTERVAL_CHECK);