import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { ObjectType, Field } from 'type-graphql';

@ObjectType()
@Entity({ tableName: 'posts' })
export class Post {
  @Field()
  @PrimaryKey()
  id!: number;

  @Field(() => String)
  @Property({ type: 'date' })
  createdAt: Date = new Date();

  @Field(() => String)
  @Property({ type: 'date', onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Field()
  @Property({ type: 'text' })
  title!: string;
}
