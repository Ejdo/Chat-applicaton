import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'
import Channel from 'App/Models/Channel'

export default class Message extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public content: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column({
    serializeAs: null,
  })
  public createdBy: number

  @column()
  public channelId: number

  @belongsTo(() => User, {
    foreignKey: 'createdBy',
    serializeAs: 'author',
  })
  public author: BelongsTo<typeof User>

  @belongsTo(() => Channel, {
    foreignKey: 'channelId',
    serializeAs: null,
  })
  public channel: BelongsTo<typeof Channel>
}
