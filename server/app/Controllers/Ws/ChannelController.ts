import { WsContextContract } from '@ioc:Ruby184/Socket.IO/WsContext'
import Channel from 'App/Models/Channel'
import User from 'App/Models/User'

export default class ChannelController {
  public async leaveChannel({ params, socket, auth }: WsContextContract) {
    const channel = await Channel.query()
      .where('name', params.name)
      .withCount('users', (query) => query.wherePivot('is_banned', false))
      .firstOrFail()
    // check if the user didn't join the server or got banned
    if (
      !(await channel
        .related('users')
        .query()
        .where('user_id', auth.user!.id)
        .andWherePivot('is_banned', false)
        .first())
    ) {
      return {
        message: 'You cannot leave a channel you are not member of',
      }
    }

    if (
      (await channel.related('creator').query().where('id', auth.user!.id).first()) ||
      channel.$extras.user_count === 1
    ) {
      await channel.delete()
      socket.broadcast.disconnectSockets() // close current channel's namespace
      return
    }

    await channel.related('users').detach([auth.user!.id])
    socket.broadcast.emit('userLeft', auth.user!.serialize())
  }

  public async revokeUser({ params, socket, auth }: WsContextContract, username: string) {
    const channel = await Channel.findByOrFail('name', params.name)
    const revokedUser = await User.findByOrFail('username', username)

    if (
      !(await channel
        .related('users')
        .query()
        .where('user_id', auth.user!.id)
        .andWherePivot('is_banned', false)
        .first())
    ) {
      return {
        message: 'You cannot revoke a user from a channel you are not member of',
      }
    }

    // user is already revoked from the channel
    if (await channel.related('users').query().where('user_id', revokedUser.id).first()) {
      return
    }

    if (channel.isPublic) {
      return {
        message: 'You cannot revoke a user from a public channel',
      }
    }

    if (!(await channel.related('creator').query().where('id', auth.user!.id).first())) {
      return {
        message: "You cannot revoke a user from a channel you don't own",
      }
    }

    await channel.related('users').detach([revokedUser.id])
    socket.broadcast.emit('userLeft', revokedUser.serialize())
  }

  // this is in the global namespace '/'
  public async inviteToChannel(
    { socket, auth }: WsContextContract,
    channelName: string,
    username: string
  ) {
    const invitedUser = await User.findByOrFail('username', username)
    const channel = await Channel.findByOrFail('name', channelName)
    await channel.load('users')

    // the user is not a member of the channel
    if (!(await channel.related('users').query().where('user_id', auth.user!.id).first())) {
      return {
        message: 'You cannot invite a user to a channel you are not member of',
      }
    }

    // the channel is private and the user isn't its owner
    if (
      !channel.isPublic &&
      !(await channel.related('creator').query().where('id', auth.user!.id).first())
    ) {
      return {
        message: 'You cannot invite a user to a private channel unless you are its owner',
      }
    }

    if (await channel.related('users').query().where('user_id', invitedUser.id).first()) {
      return {
        message: 'You cannot invite a user to the channel they already joined',
      }
    }

    await channel.related('users').attach([invitedUser.id])

    // emit only on the invited user's socket
    socket.in(this.getUserRoom(invitedUser)).emit('newChannel', channel.serialize())
  }

  public async kick({ auth, socket, params }: WsContextContract, username: string) {
    const channel = await Channel.findByOrFail('name', params.name)

    // first, check if the user is in the channel
    if (!(await channel.related('users').query().where('user_id', auth.user!.id).first())) {
      return {
        message: 'You cannot vote to kick a user from a server you are not member of',
      }
    }

    if (!channel.isPublic) {
      return {
        message: 'You cannot vote to kick a user from a private server',
      }
    }

    const kickedUser = await User.findByOrFail('username', username)
    if (!(await channel.related('users').query().where('user_id', kickedUser.id).first())) {
      return {
        message: 'You cannot vote to kick a user from a server they are not member of',
      }
    }

    if (kickedUser.id === auth.user!.id) {
      return {
        message: 'You cannot vote to kick yourself',
      }
    }

    if (await channel.related('creator').query().where('id', auth.user!.id).first()) {
      // delete the channel
      await channel.delete()
      socket.broadcast.disconnectSockets() // close current channel's namespace
      return
    }

    if (await channel.related('creator').query().where('id', kickedUser.id).first()) {
      return {
        message: 'You cannot vote to kick the creator of the server',
      }
    }

    // 2 users already kicked this user
    if (await channel.related('users').query().wherePivot('kick_votes', 2)) {
      await channel.load('users')
    }
  }

  public async loadUsers({ params }: WsContextContract) {
    const channel = await Channel.findByOrFail('name', params.name)
    const users = await channel.related('users').query().wherePivot('is_banned', false)
    return users.map((user) => user.serialize())
  }

  private getUserRoom(user: User): string {
    return `user:${user.id}`
  }
}
