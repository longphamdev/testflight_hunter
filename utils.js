import http from 'http';
import  { sendMessage } from './telegramBotApi.js';
import fs from 'fs';

export const getMessageApi = (botToken) =>  `https://api.telegram.org/bot${botToken}/sendMessage`;

// this server using for keep alive free hosting and checking bot is alive
export const server = (chatId, botUptimeTrackerToken,port) => http.createServer(async function(req, res) {
    // send message to uptime tracker bot
    await sendMessage(`Server is running on port: ${port}`, chatId, botUptimeTrackerToken);
    res.write(`Server is running on port ${port}`);
    res.end();
  }).listen(port);
