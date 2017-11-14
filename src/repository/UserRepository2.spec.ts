import { createConnection } from 'typeorm';
import { QueryRunner } from 'typeorm/query-runner/QueryRunner';
import { UserRepository } from './UserRepository';

describe('UserRepository', () => {
  let connection;
  let queryRunner: QueryRunner;

  beforeAll(async () => {
    connection = await createConnection();
    queryRunner = connection.createQueryRunner();
  });

  beforeEach(async () => {
    await queryRunner.startTransaction();
  });

  afterEach(async () => {
    await queryRunner.rollbackTransaction();
  });

  afterAll(async () => {
    await connection.close();
  });

  test('works', (async () => {
    const teamPayload = {
      name: 'myteam',
      slackId: 'asdf1234',
    };
    const userPayload = {
      email: 'slaquiz@gmail.com',
      name: 'seungha',
      slackId: 'fdsa4321',
    };
    const userRepo = queryRunner.manager.getCustomRepository(UserRepository);
    const {team, user} = await userRepo.firstOrCreateTeamAndUser(teamPayload, userPayload);
    expect(team.id).toBe(1);
    expect(user.id).toBe(1);
  }));

  // describe('firstOrCreateTeamAndUser', () => {

  // });
});
