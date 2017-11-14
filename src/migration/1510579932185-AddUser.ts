import {MigrationInterface, QueryRunner} from 'typeorm';

export class AddUser1510579932185 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('CREATE TABLE "user" ("id" SERIAL NOT NULL, "slackId" character varying NOT NULL, "email" character varying NOT NULL, "name" character varying NOT NULL, PRIMARY KEY("id"))');
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('DROP TABLE "user"');
    }

}
