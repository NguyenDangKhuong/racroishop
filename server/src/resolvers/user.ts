// import { Context } from '../types/Context'
import { User } from '../entities/User';
import { Arg, Mutation, Resolver } from 'type-graphql';
import argon2 from 'argon2';
import { UserMutationResponse } from '../types/UserMutationResponse';

@Resolver()
export class UserResolver {
  @Mutation((_returns) => UserMutationResponse, { nullable: true })
  async register(
    @Arg('email') email: string,
    @Arg('username') username: string,
    @Arg('password') password: string
  ): Promise<UserMutationResponse> {
    try {
      const existingUser = await User.findOne({
        where: [{ username }, { email }],
      });
      if (existingUser) {
        return {
          code: 400,
          success: false,
          message: 'User already registered',
          error: [
            {
              field: existingUser.username === username ? 'username' : 'email',
              message: `${existingUser.username === username ? 'username' : 'email'} already taken`
            },
          ],
        };
      }

      const hashedPassword = await argon2.hash(password);

      const newUser = User.create({
        username,
        email,
        password: hashedPassword,
      });
      return {
        code: 200,
        success: true,
        message: 'User registration successful',
        user: await User.save(newUser)
      };
    } catch (err) {
      console.log(err);
      return {
        code: 500,
        success: false,
        message: `Internal server error ${err.message}`
      };
    }
  }
}
