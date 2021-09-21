// import { Context } from '../types/Context'
import { User } from '../entities/User'
import { Arg, Mutation, Resolver, Ctx } from 'type-graphql'
import argon2 from 'argon2'
import { UserMutationResponse } from '../types/UserMutationResponse'
import { RegisterInput } from '../types/RegisterInput'
import { LoginInput } from '../types/LoginInput'
import { validateRegisterInput } from '../utils/validateRegisterInput'
import { Context } from '../types/Context'
import { COOKIE_NAME } from '../constants'

@Resolver()
export class UserResolver {
  @Mutation((_returns) => UserMutationResponse, { nullable: true })
  async register(
    @Arg('registerInput') registerInput: RegisterInput
  ): Promise<UserMutationResponse> {
    const validateRegisterInputErrors = validateRegisterInput(registerInput)
    if (validateRegisterInputErrors !== null)
      return { code: 400, success: false, ...validateRegisterInputErrors }
    try {
      const { username, email, password } = registerInput
      const existingUser = await User.findOne({
        where: [{ username }, { email }]
      })
      if (existingUser) {
        return {
          code: 400,
          success: false,
          message: 'Tài khoản đã được đăng kí',
          errors: [
            {
              field: existingUser.username === username ? 'username' : 'email',
              message: `${
                existingUser.username === username ? 'Username' : 'Email'
              } đã được dùng`
            }
          ]
        }
      }

      const hashedPassword = await argon2.hash(password)

      const newUser = User.create({
        username,
        email,
        password: hashedPassword
      })
      return {
        code: 200,
        success: true,
        message: 'Đã đăng kí tài khoản thành công',
        user: await User.save(newUser)
      }
    } catch (err) {
      console.log(err)
      return {
        code: 500,
        success: false,
        message: `Internal server error ${err.message}`
      }
    }
  }

  @Mutation((_return) => UserMutationResponse)
  async login(
    @Arg('loginInput') { usernameOrEmail, password }: LoginInput,
    @Ctx() { req }: Context
  ): Promise<UserMutationResponse> {
    try {
      const existingUser = await User.findOne(
        usernameOrEmail.includes('@')
          ? { email: usernameOrEmail }
          : { username: usernameOrEmail }
      )

      if (!existingUser)
        return {
          code: 400,
          success: false,
          message: 'Tài khoản không tồn tại',
          errors: [
            {
              field: 'usernameOrEmail',
              message: 'Username or email không đúng'
            }
          ]
        }

      const passwordValid = await argon2.verify(existingUser.password, password)

      if (!passwordValid)
        return {
          code: 400,
          success: false,
          message: 'Password đã nhập sai',
          errors: [{ field: 'password', message: 'Password đã nhập sai' }]
        }

      // Create session and return cookie
      req.session.userId = existingUser.id

      return {
        code: 200,
        success: true,
        message: 'Đăng nhập thành công',
        user: existingUser
      }
    } catch (error) {
      console.log(error)
      return {
        code: 500,
        success: false,
        message: `Internal server error ${error.message}`
      }
    }
  }

  @Mutation((_return) => Boolean)
  logout(@Ctx() { req, res }: Context): Promise<boolean> {
    return new Promise((resolve, _reject) => {
      res.clearCookie(COOKIE_NAME)

      req.session.destroy((error) => {
        if (error) {
          console.log('DESTROYING SESSION ERROR', error)
          resolve(false)
        }
        resolve(true)
      })
    })
  }
}
