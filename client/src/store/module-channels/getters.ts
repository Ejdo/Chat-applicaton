import { GetterTree } from 'vuex'
import { StateInterface } from '../index'
import { ChannelsStateInterface } from './state'

const getters: GetterTree<ChannelsStateInterface, StateInterface> = {
  joinedChannels (context) {
    if (context.channelFilter === '') {
      return Object.keys(context.messages)
    } else {
      return Object.keys(context.messages).filter((element) => { return element.indexOf(context.channelFilter) >= 0 })
    }
  },
  currentMessages (context) {
    return context.active !== null ? context.messages[context.active] : []
  },
  lastMessageOf (context) {
    return (channel: string) => {
      const messages = context.messages[channel]
      return messages.length > 0 ? messages[messages.length - 1] : null
    }
  },
  channelMembers (context) {
    if (context.active != null) {
      return context.channelMembers[context.active]
    } else {
      return []
    }
  }
}

export default getters
