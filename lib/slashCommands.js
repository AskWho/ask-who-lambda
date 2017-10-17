const request = require('request');
const ev = require('safe-eval');
const d3 = require('d3-format');

class SlashCommand {
  constructor(cmd, config) {
    this.cmd = cmd;
    this.config = config;
    this.fn = {
      url: this._getUrl(config),
      text: this._renderText(config)
    };
  }

  _formatBody(body) {
    var format = this.config.format;
    if (!format) return body;
    for (let key in format) {
      if (body[key]) body[key] = d3.format(format[key])(body[key]);
    }

    return body;
  }

  _getArgs(tokens) {
    var config = this.config;
    var args = Object.create(null);
    Array.isArray(config.args) &&
      config.args.forEach((key, i) => {
        args[key] = tokens[i];
      });
    return args;
  }

  _getUrl(config) {
    config = config || this.config;
    try {
      return ev('function(args) { return `' + config.url + '`;};');
    } catch (err) {
      console.error(err.stack);
    }
    return () => 'renderer error';
  }

  _renderText(config) {
    config = config || this.config;
    try {
      return ev('function(args, body) { return `' + config.text + '`;};');
    } catch (err) {
      console.error(err.stack);
    }
    return () => 'renderer error';
  }

  query(fbMsg) {
    return new Promise(resolve => {
      var method = this.config.method || 'get';
      var args = this._getArgs(fbMsg.tokens);
      var url = this.fn.url(args);
      request({method, url}, (error, response, body) => {
        try {
          var json = JSON.parse(body);
          var text = Array.isArray(json)
            ? json
                .map(o => this.fn.text(args, this._formatBody(o)))
                .join('\n\n')
            : this.fn.text(args, this._formatBody(json));
          resolve({text});
        } catch (err) {
          console.error(err);
        }
      });
    });
  }
}

class SlashCommands {
  constructor(map) {
    var cmdMap = Object.create(null);
    for (let key in map) {
      cmdMap[key] = new SlashCommand(key, map[key]);
    }
    this.map = cmdMap;
  }

  start(cmd) {
    return this.map[cmd];
  }
}

module.exports = SlashCommands;
