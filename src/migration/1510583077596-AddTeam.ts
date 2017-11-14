import {MigrationInterface, QueryRunner} from 'typeorm';

export class AddTeam1510583077596 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('CREATE TABLE "team" ("id" SERIAL NOT NULL, "slackId" character varying NOT NULL, PRIMARY KEY("id"))');
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('DROP TABLE "team"');
    }

}
