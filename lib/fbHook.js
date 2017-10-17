const request = require('request');

class FbMsg {
  constructor(str) {
    var {cmd, tokens} = this._parseMsg(str);
    this.cmd = cmd;
    this.tokens = tokens;
  }

  _parseMsg(str) {
    if (!str) return;
    var tokens = str.trim().split(/ +/g);
    if (tokens.length === 0) return;
    var cmd = tokens
      .shift()
      .toLowerCase()
      .slice(1);
    return {cmd, tokens};
  }
}

class FbHook {
  constructor(recipientId) {
    this.recipientId = recipientId;
  }

  text({text}) {
    var messageData = {recipient: {id: this.recipientId}, message: {text}};
    return FbHook.callSendAPI(messageData);
  }

  static callSendAPI(messageData) {
    return new Promise((resolve, reject) => {
      request(
        {
          uri: 'https://graph.facebook.com/v2.6/me/messages',
          qs: {access_token: process.env.FB_TOKEN},
          method: 'POST',
          json: messageData
        },
        function(error, response, body) {
          if (!error && response.statusCode == 200) {
            resolve();
          } else {
            console.error('Unable to send message.');
            console.error(body);
            console.error(error);
            reject(error);
          }
        }
      );
    });
  }

  static tranform(cmds, id, str) {
    var msg = new FbMsg(str);
    var fbhook = new FbHook(id);
    var ctx = cmds.start(msg.cmd);
    if (ctx) {
      return ctx.query(msg).then(fbhook.text.bind(fbhook));
    }
    return fbhook.text({text: `/${msg.cmd} command not known!`});
  }

  static handleMessage(cmds, event) {
    var senderID = event.sender.id;
    // var recipientID = event.recipient.id;

    // var timeOfMessage = event.timestamp;
    var message = event.message;
    // var messageId = message.mid;

    var messageText = message.text;
    // var messageAttachments = message.attachments;
    return FbHook.tranform(cmds, senderID, messageText);
  }

  static handle(cmds, data) {
    var promises = [];
    // Make sure this is a page subscription
    if (data.object === 'page') {
      // Iterate over each entry - there may be multiple if batched
      data.entry.forEach(entry => {
        // Iterate over each messaging event
        entry.messaging.forEach(event => {
          if (event.message) promises.push(FbHook.handleMessage(cmds, event));
          else console.warn('Webhook received unknown event: ', event);
        });
      });
    }
    return Promise.all(promises);
  }
}

module.exports = FbHook;
