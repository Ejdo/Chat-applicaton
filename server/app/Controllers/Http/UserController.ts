import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UserDetailValidator from 'App/Validators/UserDetailValidator'

export default class UserController {
  public async update({ auth, request }: HttpContextContract) {
    const data = await request.validate(UserDetailValidator)
    await auth.user!.merge(data).save()
    return auth.user
  }
}
