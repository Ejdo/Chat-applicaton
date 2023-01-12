import { DateTime } from 'luxon'
import {
  BaseModel,
  BelongsTo,
  belongsTo,
  column,
  HasMany,
  hasMany,
  ManyToMany,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import Message from 'App/Models/Message'
import User from 'App/Models/User'

export default class Channel extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public isPublic: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column()
  public creatorId?: number

  @hasMany(() => Message, {
    foreignKey: 'channelId',
    serializeAs: null,
  })
  public messages: HasMany<typeof Message>

  @manyToMany(() => User, {
    pivotTable: 'channel_users',
    pivotForeignKey: 'channel_id',
    pivotRelatedForeignKey: 'user_id',
    pivotTimestamps: true,
    pivotColumns: ['kick_votes', 'is_banned', 'is_read', 'banned_at'],
  })
  public users: ManyToMany<typeof User>

  @belongsTo(() => User, {
    localKey: 'id',
    foreignKey: 'creatorId',
    serializeAs: 'creator',
  })
  public creator: BelongsTo<typeof User>
}
