const { promisify } = require("util");
const Request = require("request");

exports.getPromise = promisify(Request.get);
exports.postPromise = promisify(Request.post);
exports.putPromise = promisify(Request.put);