# Chat Server
Chat server used to manage chats in website

Chat is based on event system communication. All events used client-side and server-side are listed and described here.

___

## Table Of Contents
* [Starting Up](#starting-up)
* [Tests](#tests)
* [Client-side Events](#client-side-events)
  * [connection](#connection-c)
  * [auth](#auth-c)
  * [message](#message-c)
  * [cerror](#cerror-c)
* [Server-side Events](#server-side-events)
  * [connection](#connection-s)
  * [disconnect](#disconnect-s)
  * [auth](#auth-s)
  * [message](#message-s)
  * [setTestMode](#settestmode-s)
  * [resetSocket](#resetsocket-s)
* [Errors](#errors)
  * [400 (Syntax Error)](#400-syntax-error)
  * [401 (Authentification required)](#401-authentification-required)
  * [403 (Unauthorized)](#403-unauthorized)

## Starting up
Install all the dependencies using `npm install`
After that, you can run the server using `npm start`.
You can specify the port as following: `npm start PORT`
## Tests
Please put the server adress in `tests\configs.js` !
Install all the dependencies using `npm install`
First, start a server as described previously.
Then, you can run all the tests using `npm test`
___
## Client-side Events
Client-side events are all events sended by the server to the client.
### connection (C)
This event is received when the connection is established with the server.
The server will wait for you to send an Auth event or to disconnect.
Other sended events will result in a cerror ([401 Authentification required](#401-authentification-required)).
### auth (C)
This event is received when the authentification was succesfuly made !
Exemple of data received:
```javascript
{
 'Code': 200,
 'message': 'Authentification complete'
}
```
### message (C)
This event is received when a message was sent to the server by a client in the same room.
Exemple of data received:
```javascript
{
 'username': 'nickname',
 'content': 'original message'
}
```
### cerror (C)
This event is received when something unexpected from the client occured.
Exemple of data received:
```javascript
{
 'Code': 401,
 'message': 'Authentification required'
}
```
## Server-side Events
Server-side events are all events clients are allowed to send to the server !
### connection (S)
This event is used to establish connection with the server.
### disconnect (S)
This event must be sended when disconnecting from the server !
### auth (S)
This event is used to authentificate to the server after the connection has been made.
It must be sent before sending any other event (except disconnect).
Exemple of data sended:
```javascript
{
 'username': 'nickname',
 'password': 'encrypted password',
 'room': 'stream name'
}
```
### message (S)
This event is used to send a message to all users inside the current client's room.
The sender will also receive the message event from the server.
Exemple of data sended:
```javascript
{
 'content': 'formated message',
}
```
### setTestMode (S)
This event is used to enable/disable test mode for the current client.
Exemple of data sended:
```javascript
{
 'value': true/false,
}
```
### resetSocket (S)
*Test mode only!*
This event is used to reset the client to it's default state.
___
## Errors
### 400 (Syntax Error)
The received event does not follow the required format.
Some mandatory properties are missing.
### 401 (Authentification required)
To perform the followed event, the user must be authentificated (see [auth event](#auth-s)).
### 403 (Unauthorized)
The user is not allowed to perfom the event.
