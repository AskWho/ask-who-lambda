ask-who-lambda
============

# API Reference
Handlers for AWS lambda function.


* [handler](#module_handler)
    * [.subscribe(event, context, callback)](#module_handler.subscribe)
    * [.webhook(event, context, callback)](#module_handler.webhook)

<a name="module_handler.subscribe"></a>

### handler.subscribe(event, context, callback)
Handler for App to subscribe to a FB page.

**Kind**: static method of [<code>handler</code>](#module_handler)  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>Object</code> | source event |
| context | <code>Object</code> | AWS lambda context |
| callback | <code>callback</code> | A callback `function(error, response)` to exec when lambda function is completed. |

<a name="module_handler.webhook"></a>

### handler.webhook(event, context, callback)
Handler for App to receive notification from FB Messenger.

**Kind**: static method of [<code>handler</code>](#module_handler)  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>Object</code> | source event |
| context | <code>Object</code> | AWS lambda context |
| callback | <code>callback</code> | A callback `function(error, response)` to exec when lambda function is completed. |

