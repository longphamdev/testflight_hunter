import { config } from 'dotenv';
config();

// get from env file
const CHAT_ID = process.env.CHAT_ID;
const BOT_WATCHER_TOKEN = process.env.BOT_WATCHER_TOKEN;
const BOT_UPTIME_TRACKER_TOKEN = process.env.BOT_UPTIME_TRACKER_TOKEN;
const ID_LIST = process.env.ID_LIST.split(',');
const SLEEP_TIME = process.env.INTERVAL_CHECK;
const ENABLE_UPTIME_TRACKER = process.env.ENABLE_UPTIME_TRACKER;
const PORT = process.env.PORT;

const XPATH_STATUS = '.beta-status span';
const TESTFLIGHT_URL = 'https://testflight.apple.com/join/';
const FULL_TEXT = 'This beta is full.';
const NOT_OPEN_TEXT = "This beta isn't accepting any new testers right now.";
const TITLE_REGEX = /Join the (.+) beta - TestFlight - Apple/;

const constant = {
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
}

export default constant;