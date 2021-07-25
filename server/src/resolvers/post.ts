import { Resolver, Query } from 'type-graphql';

@Resolver()
export class PostResolver {
  @Query(() => String)
  posts() {
    return 'Displaying a list of posts';
  }
}
