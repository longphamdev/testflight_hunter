import http from 'http';

export const getMessageApi = (botToken) =>  `https://api.telegram.org/bot${botToken}/sendMessage`;

// this server using for keep alive free hosting and checking bot is alive
export const server = () => http.createServer(async function(req, res) {
    res.write(`Bot is alive`);
    res.end();
  }).listen(8080);
