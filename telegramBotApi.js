import axios from 'axios';
import { getMessageApi } from './utils.js';
import TelegramBot from 'node-telegram-bot-api';

// send message to telegram bot
export const sendMessage =  (message,chatId,botToken)=>{
  // Define the request payload
    const payload = {
        chat_id: chatId,
        text: message,
      };
    // return a promise to post the payload to the bot
    return axios
    .post(getMessageApi(botToken), payload)
    .catch(error => {
        console.log(error.response.status,` - ${error.response.data.description}`)
    });
}

export const botHandleMessage = (botToken)=>{
  // Create a new bot instance
const bot = new TelegramBot(botToken, { polling: true });


// Event listener for the /start command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  console.log("Welcome!!!", chatId)
  // Handle the /start command here
});

// add tfId to watch list
// remove tfId from watch list
bot.onText(/\/add/, (msg) => {
  const chatId = msg.chat.id;
  console.log(chatId,msg.text)
});

// remove tfId from watch list
bot.onText(/\/remove/, (msg) => {
  const chatId = msg.chat.id;
  console.log(chatId,msg.text)
});
}

