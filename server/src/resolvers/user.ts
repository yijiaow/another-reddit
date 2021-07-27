import {
  Resolver,
  Ctx,
  Arg,
  Mutation,
  InputType,
  Field,
  ObjectType,
} from 'type-graphql';
import { User } from '../entities/User';
import { Context } from '../types';
import argon2 from 'argon2';

@InputType()
class UsernamePasswordInput {
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
  @Mutation(() => User)
  async register(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() { em }: Context
  ): Promise<User> {
    if (options.username.length < 3) {
      return { errors: [{ field: 'username', message: 'Username too short' }] };
    }

    if (options.password.length < 3) {
      return { errors: [{ field: 'password', message: 'Password too short' }] };
    }

    const hash = await argon2.hash(options.password);

    try {
      const user = em.create(User, {
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

    return { user };
  }

  @Mutation(() => User)
  async login(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() { em }: Context
  ): Promise<UserResponse> {
    const user = await em.findOne(User, { username: options.username });

    if (!user) {
      return {
        errors: [{ field: 'username', message: 'User does not exist' }],
      };
    }

    const isMatch = await argon2.verify(user.password, options.password);

    if (!isMatch) {
      return { errors: [{ field: 'password', message: 'Incorrect password' }] };
    }

    return { user };
  }
}
