import { Migration } from '@mikro-orm/migrations';

export class Migration20210803063523 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "users" add column "email" text not null;');
    this.addSql('alter table "users" add constraint "users_email_unique" unique ("email");');

    this.addSql('alter table "users" add constraint "users_email_unique" unique ("email");');
  }

}
