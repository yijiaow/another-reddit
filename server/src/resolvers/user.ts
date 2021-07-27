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
  @Query(() => User, { nullable: true })
  async me(@Ctx() { req, em }: Context) {
    if (!req.session.uid) return null;

    const user = await em.findOne(User, { id: req.session.uid });

    return user;
  }

  @Mutation(() => User)
  async register(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() { req, em }: Context
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

    req.session.uid = user.id;

    return { user };
  }

  @Mutation(() => User)
  async login(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() { req, em }: Context
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

    req.session.uid = user.id;

    return { user };
  }
}
