// import { Context } from '../types/Context'
import { User } from '../entities/User'
import { Arg, Mutation, Resolver, Ctx, Query } from 'type-graphql'
import argon2 from 'argon2'
import { UserMutationResponse } from '../types/UserMutationResponse'
import { RegisterInput } from '../types/RegisterInput'
import { LoginInput } from '../types/LoginInput'
import { validateRegisterInput } from '../utils/validateRegisterInput'
import { Context } from '../types/Context'
import { COOKIE_NAME } from '../constants'
import { TokenModel } from '../models/Token'
import { ChangePasswordInput } from '../types/ChangePasswordInput'
import { ForgotPasswordInput } from '../types/ForgotPassword'
import { v4 as uuidv4 } from 'uuid'
import { sendEmail } from '../utils/sendEmail'

@Resolver()
export class UserResolver {
  @Query((_returns) => User, { nullable: true })
  async me(@Ctx() { req }: Context): Promise<User | undefined | null> {
    if (!req.session.userId) return null
    const user = await User.findOne(req.session.userId)
    return user
  }
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
        message: `Lỗi hệ thống ${err.message}`
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
              message: 'Tài khoản đăng nhập không đúng'
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
        message: `Lỗi hệ thống ${error.message}`
      }
    }
  }

  @Mutation((_return) => Boolean)
  logout(@Ctx() { req, res }: Context): Promise<boolean> {
    return new Promise((resolve, _reject) => {
      res.clearCookie(COOKIE_NAME)

      req.session.destroy((error) => {
        if (error) {
          console.log('Lỗi huỷ session:', error)
          resolve(false)
        }
        resolve(true)
      })
    })
  }

  @Mutation((_return) => Boolean)
  async forgotPassword(
    @Arg('forgotPasswordInput') forgotPasswordInput: ForgotPasswordInput
  ): Promise<boolean> {
    const user = await User.findOne({ email: forgotPasswordInput.email })

    if (!user) return true

    await TokenModel.findOneAndDelete({ userId: `${user.id}` })

    const resetToken = uuidv4()
    const hashedResetToken = await argon2.hash(resetToken)

    // save token to db
    await new TokenModel({
      userId: `${user.id}`,
      token: hashedResetToken
    }).save()

    // send reset password link to user via email
    await sendEmail(
      forgotPasswordInput.email,
      `<a href="http://localhost:3002/change-password?token=${resetToken}&userId=${user.id}">Bấm vào đây để sửa mật khẩu của bạn</a>`
    )

    return true
  }

  @Mutation((_return) => UserMutationResponse)
  async changePassword(
    @Arg('token') token: string,
    @Arg('userId') userId: string,
    @Arg('changePasswordInput') changePasswordInput: ChangePasswordInput,
    @Ctx() { req }: Context
  ): Promise<UserMutationResponse> {
    if (changePasswordInput.newPassword.length <= 2) {
      return {
        code: 400,
        success: false,
        message: 'Sai mật khẩu',
        errors: [{ field: 'newPassword', message: 'Mật khẩu phải lớn hơn 2' }]
      }
    }

    try {
      const resetPasswordTokenRecord = await TokenModel.findOne({ userId })
      if (!resetPasswordTokenRecord) {
        return {
          code: 400,
          success: false,
          message: 'Token đổi mật khẩu không đúng hoặc đã hết hạn',
          errors: [
            {
              field: 'token',
              message: 'Token đổi mật khẩu không đúng hoặc đã hết hạn'
            }
          ]
        }
      }

      const resetPasswordTokenValid = argon2.verify(
        resetPasswordTokenRecord.token,
        token
      )

      if (!resetPasswordTokenValid) {
        return {
          code: 400,
          success: false,
          message: 'Token đổi mật khẩu không đúng hoặc đã hết hạn',
          errors: [
            {
              field: 'token',
              message: 'Token đổi mật khẩu không đúng hoặc đã hết hạn'
            }
          ]
        }
      }

      const userIdNum = parseInt(userId)
      const user = await User.findOne(userIdNum)

      if (!user) {
        return {
          code: 400,
          success: false,
          message: 'Tài khoản người dùng không còn tồn tại',
          errors: [
            {
              field: 'token',
              message: 'Tài khoản người dùng không còn tồn tại'
            }
          ]
        }
      }

      const updatedPassword = await argon2.hash(changePasswordInput.newPassword)
      await User.update({ id: userIdNum }, { password: updatedPassword })

      await resetPasswordTokenRecord.deleteOne()

      req.session.userId = user.id

      return {
        code: 200,
        success: true,
        message: 'Reset password thành công',
        user
      }
    } catch (error) {
      console.log(error)
      return {
        code: 500,
        success: false,
        message: `Lỗi hệ thống ${error.message}`
      }
    }
  }
}
