import { User } from 'src/contracts/Auth'

export interface Channel {
  id: number,
  name: string,
  isPublic: boolean,
  createdAt: string,
  updatedAt: string,
  creatorId: number,
  users: User[],
  creator: User
}
