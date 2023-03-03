import { MigrationInterface, QueryRunner } from "typeorm"
import argon2 from "argon2";

export class AddTestUser1662386709902 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const hashedPassword = await argon2.hash("test1");
        await queryRunner.query("insert into user (username, password, email) values ('chris', '" + hashedPassword + "' , 'ceastway@gmail.com');")
    }

    public async down(_queryRunner: QueryRunner): Promise<void> {
    }

}
