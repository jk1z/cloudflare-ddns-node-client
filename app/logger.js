const Fs = require('fs').promises;
const Moment = require("moment-timezone");
exports.info = async (message) => {
    await Fs.appendFile("logs.txt", `${Moment.tz('Australia/Melbourne').format()} [INFO] ${message}\n`, "utf-8");
};
exports.warn = async (message) => {
    await Fs.appendFile("logs.txt", `${Moment.tz('Australia/Melbourne').format()} [WARN] ${message}\n`, "utf-8");
};
exports.error = async (message) => {
    await Fs.appendFile("logs.txt", `${Moment.tz('Australia/Melbourne').format()} [ERROR] ${message}\n`, "utf-8");
};