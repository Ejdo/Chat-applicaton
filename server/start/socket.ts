/*
|--------------------------------------------------------------------------
| Websocket events
|--------------------------------------------------------------------------
|
| This file is dedicated for defining websocket namespaces and event handlers.
|
*/

import Ws from '@ioc:Ruby184/Socket.IO/Ws'

Ws.namespace('/')
  .connected('ActivityController.onConnected')
  .disconnected('ActivityController.onDisconnected')
  .on('inviteToChannel', 'ChannelController.inviteToChannel')
  .on('user:online', 'ActivityController.online')
  .on('user:offline', 'ActivityController.offline')
  .on('user:dnd', 'ActivityController.dnd')

// this is dynamic namespace, in controller methods we can use params.name
Ws.namespace('channels/:name')
  // .middleware('channel') // check if user can join given channel
  .on('loadMessages', 'MessageController.loadMessages')
  .on('addMessage', 'MessageController.addMessage')
  .on('leaveChannel', 'ChannelController.leaveChannel')
  .on('loadUsers', 'ChannelController.loadUsers')
  .on('revokeUser', 'ChannelController.revokeUser')
