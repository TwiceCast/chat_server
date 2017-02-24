# Chat Server
Chat server used to manage chats in website

Chat is based on event system communication. All events used client-side and server-side are listed and described here:

## Table Of Contents
* [Client-side Events](#client-side-events)
  * [connection](#connection-c)
  * [Auth](#auth-c)
  * [message](#message-c)
  * [cerror](#cerror-c)
* Server-side Events
  * [connection](#connection-s)
  * [disconnect](#disconnect-s)
  * [Auth](#auth-s)
  * [message](#message-s)

___

## Client-side Events
Client-side events are all events sended by the server to the client.
### connection (C)
This event is received when the connection is established with the server.
The server will wait for you to send an Auth event or to disconnect.
Other sended events will result in a cerror (401 Unauthorized).
### Auth (C)
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
 'user': 'nickname',
 'content': 'formated message',
 'raw_content': 'original message'
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
### Auth (S)
This event is used to authentificate to the server after the connection has been made.
It must be sent before sending any other event (except disconnect).
Exemple of data sended:
```javascript
{
 'user': 'nickname',
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
 'raw_content': 'original message'
}
```
