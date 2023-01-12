import { User, WsResponse } from 'src/contracts'
import { authManager } from '.'
import { BootParams, SocketManager } from './SocketManager'
import { Channel } from 'src/contracts/Channel'

class ActivitySocketManager extends SocketManager {
  public subscribe ({ store }: BootParams): void {
    this.socket.on('user:list', (onlineUsers: User[]) => {
      console.log('Online users list', onlineUsers)
    })

    this.socket.on('user:online', (user: User) => {
      console.log('User is online', user)
      store.commit('channels/SET_USER_STATUS', { user, statusId: 0 })
    })

    this.socket.on('user:offline', (user: User) => {
      console.log('User is offline', user)
      store.commit('channels/SET_USER_STATUS', { user, statusId: 1 })
    })

    this.socket.on('user:dnd', (user: User) => {
      console.log('User is dnd', user)
      store.commit('channels/SET_USER_STATUS', { user, statusId: 2 })
    })

    this.socket.on('newChannel', (channel: Channel) => {
      store.dispatch('channels/join', channel.name)
    })

    authManager.onChange((token) => {
      if (token) {
        this.socket.connect()
      } else {
        this.socket.disconnect()
      }
    })
  }

  public inviteUser (channelName: string, username: string): Promise<WsResponse> {
    return this.emitAsync('inviteToChannel', channelName, username)
  }

  public changeStatus (status: number): Promise<WsResponse> {
    return this.emitAsync('changeStatus', status)
  }
}

export default new ActivitySocketManager('/')
