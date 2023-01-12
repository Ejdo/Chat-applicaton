import { SerializedMessage, User } from 'src/contracts'

export interface ChannelsStateInterface {
  loading: boolean,
  error: Error | null,
  messages: { [channel: string]: SerializedMessage[] }
  channelMembers: { [channel: string]: User[]}
  active: string | null
  channelFilter: string
}

export default function (): ChannelsStateInterface {
  return {
    loading: false,
    error: null,
    messages: {},
    channelMembers: {},
    active: null,
    channelFilter: ''
  }
}
