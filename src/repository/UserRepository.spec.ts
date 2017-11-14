import { createConnection } from 'typeorm';
import { QueryRunner } from 'typeorm/query-runner/QueryRunner';
import { UserRepository } from './UserRepository';

async function createTestHelper() {
  const connection = await createConnection();
  const queryRunner = connection.createQueryRunner();
  return {
    closeConnection: () => {
      return connection.close();
    },
    inTransaction: (testFunction: (QueryRunner) => Promise<any>) => async () => {
      await queryRunner.startTransaction();
      await testFunction(queryRunner);
      await queryRunner.rollbackTransaction();
    },
  };
}

describe('UserRepository', () => {
  let inTransaction;
  let closeConnection;

  beforeAll(async () => {
    const helper = await createTestHelper();
    inTransaction = helper.inTransaction;
    closeConnection = helper.closeConnection;
  });

  afterAll(async () => {
    await closeConnection();
  });

  test('inTransaction is a function', () => {
    expect(typeof inTransaction).toBe('function');
    expect(inTransaction).toBeInstanceOf(Function);
  });

  test('simple add', (async () => {
    await inTransaction(async (qr: QueryRunner) => {
      const teamPayload = {
        name: 'myteam',
        slackId: 'asdf1234',
      };
      const userPayload = {
        email: 'slaquiz@gmail.com',
        name: 'seungha',
        slackId: 'fdsa4321',
      };
      const userRepo = qr.manager.getCustomRepository(UserRepository);
      const {team, user} = await userRepo.firstOrCreateTeamAndUser(teamPayload, userPayload);
      expect(team.id).toBe(1);
      expect(user.id).toBe(1);
    });
  }));
});
