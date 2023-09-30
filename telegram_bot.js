import axios from 'axios';
import { getMessageApi } from './utils.js';

// send message to telegram bot
const sendMessage =  (message,chatId,botToken)=>{
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

export default sendMessage;