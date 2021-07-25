import { Resolver, Ctx, Arg, Mutation, InputType, Field } from 'type-graphql';
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

@Resolver()
export class UserResolver {
  @Mutation(() => User)
  async register(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() { em }: Context
  ): Promise<User> {
    const hash = await argon2.hash(options.password);
    const user = em.create(User, {
      username: options.username,
      password: hash,
    });
    await em.persistAndFlush(user);

    return user;
  }
}
