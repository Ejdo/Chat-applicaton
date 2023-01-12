export interface ApiToken {
  type: 'bearer'
  token: string
  expires_at?: string
  expires_in?: number
}

export interface RegisterData {
  email: string
  password: string
  passwordConfirmation: string
  username: string
  firstName: string
  lastName: string
}

export interface LoginCredentials {
  email: string
  password: string
  remember: boolean
}

export enum UserState {
  online,
  offline,
  dnd
}

export interface User {
  id: number
  email: string
  username: string
  firstName: string
  lastName: string
  state: UserState
  createdAt: string
  updatedAt: string
}
