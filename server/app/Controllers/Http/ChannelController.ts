import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ChannelCreateValidator from 'App/Validators/ChannelCreateValidator'
import Channel from 'App/Models/Channel'

export default class ChannelController {
  public async index({ auth }: HttpContextContract) {
    return (await auth.user!.related('channels').query().wherePivot('is_banned', false)).map(
      (channel) => channel.serialize()
    )
  }

  public async create({ auth, request, response }: HttpContextContract) {
    const data = await request.validate(ChannelCreateValidator)
    let channel = await Channel.query().where('name', data.name).preload('users').first()
    if (!channel) {
      channel = await auth.user!.related('createdChannels').create(data)
      await channel.related('users').attach([auth.user!.id])
      channel.load('users')
      return channel
    }
    // channel exists

    // user already joined the channel
    if (channel.users.find((user) => user.id === auth.user!.id)) {
      return channel
    }

    // user didn't join the channel, but it is public
    if (channel.isPublic) {
      await channel.related('users').attach([auth.user!.id])
      return channel
    }

    // the channel exists, but it is private
    response.abort('A channel with this name already exists and is private')
  }
}
