import type {
  MessageRepositoryContract,
  SerializedMessage,
} from '@ioc:Repositories/MessageRepository'
import Channel from 'App/Models/Channel'
import Message from 'App/Models/Message'
import User from 'App/Models/User'

export default class MessageRepository implements MessageRepositoryContract {
  public async getAll(channelName: string): Promise<SerializedMessage[]> {
    const channel = await Channel.query()
      .where('name', channelName)
      .preload('messages', (messagesQuery) => messagesQuery.preload('author'))
      .firstOrFail()

    return channel.messages.map((message) => message.serialize() as SerializedMessage)
  }

  public async create(
    channelName: string,
    user: User,
    content: string
  ): Promise<SerializedMessage> {
    const channel = await Channel.findByOrFail('name', channelName)
    const message = new Message()
    message.content = content
    // this hack is needed since I can't think of a way to create multiple relations links at once
    message.channelId = channel.id
    await message.related('author').associate(user)
    await message.load('author')

    return message.serialize() as SerializedMessage
  }
}
