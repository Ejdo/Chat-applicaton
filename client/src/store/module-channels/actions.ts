import { ActionTree } from 'vuex'
import { StateInterface } from '../index'
import { ChannelsStateInterface } from './state'
import { RawMessage, User } from 'src/contracts'
import { activityService, channelService } from 'src/services'
import { Notify } from 'quasar'

const actions: ActionTree<ChannelsStateInterface, StateInterface> = {
  async join ({ commit }, channel: string) {
    try {
      commit('LOADING_START')
      const messages = await channelService.join(channel).loadMessages()
      commit('LOADING_SUCCESS', { channel, messages })
    } catch (err) {
      commit('LOADING_ERROR', err)
      throw err
    }
  },
  async leave ({ getters, commit }, channel: string | null) {
    const leaving: string[] = channel !== null ? [channel] : getters.joinedChannels

    leaving.forEach((c) => {
      channelService.leave(c)
      commit('CLEAR_CHANNEL', c)
    })
  },
  async inviteUser ({ commit }, { channel, username } : { channel: string, username: string }) {
    const response = await activityService.inviteUser(channel, username)
    if (response) {
      Notify.create({
        message: response.message
      })
    }
    commit('LOADING_ERROR', response)
  },
  async revokeUser ({ commit }, { channel, username } : { channel: string, username: string }) {
    const response = await channelService.in(channel)?.revokeUser(username)
    if (response) {
      Notify.create({
        message: response.message
      })
    }
    commit('LOADING_ERROR', response)
  },
  async leaveChannel ({ commit }, { channel } : { channel: string }) {
    const response = await channelService.in(channel)?.leaveChannel()
    if (response) {
      Notify.create({
        message: response.message
      })
    }
    commit('LOADING_ERROR', response)
  },
  async addMessage ({ commit }, { channel, message }: { channel: string, message: RawMessage }) {
    const newMessage = await channelService.in(channel)?.addMessage(message)
    commit('NEW_MESSAGE', { channel, message: newMessage })
  },
  setChannelFilter ({ commit }, channelName : string) {
    commit('SET_FILTER', channelName)
  },
  async getMembers ({ commit }, channel: string) {
    const channelMembers = await channelService.in(channel)?.getMembers()
    if (channelMembers) {
      commit('SET_CHANNEL_MEMBERS', { channel, channelMembers })
    }
  },
  setUserStatus ({ commit }, { user, statusId }: {statusId: number, user: User}) {
    commit('SET_USER_STATUS', { user, statusId })
  }
}

export default actions
