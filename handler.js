'use strict';
const FbHook = require('./lib/fbHook.js');
const SlashCommands = require('./lib/slashCommands.js');
const defaultCmds = require('./config/default.json');

var cmds = new SlashCommands(defaultCmds);

/**
 * Handlers for AWS lambda function.
 * @module handler
 */
module.exports.subscribe = subscribe;
module.exports.webhook = webhook;

/**
 * Handler for App to subscribe to a FB page.
 * @param {Object} event source event
 * @param {Object} context AWS lambda context
 * @param {callback} callback A callback `function(error, response)` to exec when lambda function is completed.
 * @alias module:handler.subscribe
 */
function subscribe(event, context, callback) {
  var statusCode = 403;
  var body = 'Failed validation. Make sure the validation tokens match.';
  var q = event.queryStringParameters;
  if (
    q &&
    q['hub.mode'] === 'subscribe' &&
    q['hub.verify_token'] === process.env.FB_TOKEN
  ) {
    statusCode = 200;
    body = q['hub.challenge'];
  }

  const response = {statusCode, body};

  callback(null, response);
}

/**
 * Handler for App to receive notification from FB Messenger.
 * @param {Object} event source event
 * @param {Object} context AWS lambda context
 * @param {callback} callback A callback `function(error, response)` to exec when lambda function is completed.
 * @alias module:handler.webhook
 */
function webhook(event, context, callback) {
  var statusCode = 200;
  var data = event.body;

  try {
    data = JSON.parse(data);
  } catch (err) {
    callback(null, {statusCode: 400});
    return;
  }

  FbHook.handle(cmds, data)
    .then(() => callback(null, {statusCode}))
    .catch(err => {
      console.error(err);
      callback(null, {statusCode: 400, body: err});
    });
}
