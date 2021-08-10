import {
  Resolver,
  Ctx,
  Arg,
  Mutation,
  InputType,
  Field,
  ObjectType,
  Query,
} from 'type-graphql';
import { promisify } from 'util';
import { v4 } from 'uuid';
import { User } from '../entities/User';
import { Context } from '../types';
import { FORGET_PASSWORD_PREFIX } from '../contants';
import { sendEmail } from '../utils/sendEmail';

@InputType()
class UsernamePasswordInput {
  @Field()
  email: string;

  @Field()
  username: string;

  @Field()
  password: string;
}

@ObjectType()
class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() { req, em }: Context) {
    if (!req.session.uid) return null;

    const user = await em.findOne(User, { id: req.session.uid });

    return user;
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() { req, em }: Context
  ): Promise<UserResponse> {
    if (!options.email.includes('@')) {
      return { errors: [{ field: 'email', message: 'Invalid email' }] };
    }

    if (options.username.length < 3) {
      return { errors: [{ field: 'username', message: 'Username too short' }] };
    }

    const specialsRe = /[*|\"':;<>[\]{}()`!@#$%^&*+=\s]/;
    if (specialsRe.test(options.username)) {
      return {
        errors: [
          {
            field: 'username',
            message: 'Username cannot contain special characters',
          },
        ],
      };
    }

    if (options.password.length < 3) {
      return { errors: [{ field: 'password', message: 'Password too short' }] };
    }

    const hash = await argon2.hash(options.password);

      const user = em.create(User, {
      email: options.email,
        username: options.username,
        password: hash,
      });
      await em.persistAndFlush(user);
    } catch (err) {
      // Duplicate username error
      if (err.code === '23505' || err.details.includes('already exists')) {
        return {
          errors: [{ field: 'username', message: 'Username unavailable' }],
        };
      }
    }

    req.session.uid = user.id;

    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('usernameOrEmail') usernameOrEmail: string,
    @Arg('password') password: string,
    @Ctx() { req, em }: Context
  ): Promise<UserResponse> {
    const user = await em.findOne(
      User,
      usernameOrEmail.includes('@')
        ? { email: usernameOrEmail }
        : { username: usernameOrEmail }
    );

    if (!user) {
      return {
        errors: [{ field: 'username', message: 'User does not exist' }],
      };
    }

    const isMatch = await argon2.verify(user.password, password);

    if (!isMatch) {
      return { errors: [{ field: 'password', message: 'Incorrect password' }] };
    }

    req.session.uid = user.id;

    return { user };
  }

  @Mutation(() => Boolean)
  async forgetPassword(
    @Arg('email') email: string,
    @Ctx() { em, redis }: Context
  ): Promise<Boolean> {
    const user = await em.findOne(User, { email });

    if (!user) return false;

    const token = v4();

    // @ts-ignore
    redis.set = promisify(redis.set);
    const key = FORGET_PASSWORD_PREFIX + token;
    await redis.set(key, user.id.toString(), 'EX', 60 * 60 * 24 * 3); // Set expiration time to be 3 days

    await sendEmail(
      'admin@fake.domain',
      email,
      `<a href=http://localhost:3000/change-password/${token}>Reset your password here</a>`
    );

    return true;
  }

  @Mutation(() => UserResponse)
  async changePassword(
    @Arg('token') token: string,
    @Arg('newPassword') newPassword: string,
    @Ctx() { req, em, redis }: Context
  ): Promise<UserResponse> {
    if (newPassword.length < 3) {
      return { errors: [{ field: 'password', message: 'Password too short' }] };
    }

    // @ts-ignore
    redis.get = promisify(redis.get);
    const key = FORGET_PASSWORD_PREFIX + token;
    const uid: any = await redis.get(key);

    if (!uid) {
      return { errors: [{ field: 'token', message: 'Invalid token' }] };
    }

    const user = await em.findOne(User, { id: parseInt(uid) });

    if (!user) {
      return { errors: [{ field: 'token', message: 'User no longer exists' }] };
    }

    user.password = await argon2.hash(newPassword);
    await em.persistAndFlush(user);

    // @ts-ignore
    // redis.del = promisify(redis.del);
    // await redis.del(key);

    // Sign in user with new password after reset
    req.session.uid = user.id;

    return { user };
  }
}
