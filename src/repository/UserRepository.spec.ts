import { createConnection } from 'typeorm'
import { Connection } from 'typeorm/connection/Connection'
import { QueryRunner } from 'typeorm/query-runner/QueryRunner'

import Team from '../entity/Team'
import { UserRepository } from './UserRepository'

describe('UserRepository', () => {
  let connection: Connection
  let queryRunner: QueryRunner

  beforeAll(async () => {
    connection = await createConnection()
    queryRunner = connection.createQueryRunner()
  })

  beforeEach(async () => {
    await queryRunner.startTransaction()
  })

  afterEach(async () => {
    await queryRunner.rollbackTransaction()
  })

  afterAll(async () => {
    await connection.close()
  })

  describe('firstOrCreateTeamAndUser', () => {
    const teamPayload = {
      name: 'myteam',
      slackId: 'asdf1234',
    }
    const userPayload = {
      email: 'slaquiz@gmail.com',
      name: 'seungha',
      slackId: 'fdsa4321',
    }

    test('works', async () => {
      const userRepo = queryRunner.manager.getCustomRepository(UserRepository)
      const {team, user} = await userRepo.firstOrCreateTeamAndUser(teamPayload, userPayload)
      expect(team.id).toBeDefined()
      expect(user.id).toBeDefined()
    })

    test('set isTeacher to true only if no team for user', async () => {
      const userRepo = queryRunner.manager.getCustomRepository(UserRepository)
      const {team, user} = await userRepo.firstOrCreateTeamAndUser(teamPayload, userPayload)
      expect(user.isTeacher).toBe(true)
      const user2Payload = Object.assign({}, userPayload, { slackId: 'qwer5678'})
      const {user: user2} = await userRepo.firstOrCreateTeamAndUser(teamPayload, user2Payload)
      expect(user2.isTeacher).toBe(false)
    })

    test('does not create duplicated team or user', async () => {
      const userRepo = queryRunner.manager.getCustomRepository(UserRepository)
      await userRepo.firstOrCreateTeamAndUser(teamPayload, userPayload)
      const {team, user} = await userRepo.firstOrCreateTeamAndUser(teamPayload, userPayload)
      const teamCount = await userRepo.teamCount(team.id)
      const userCount = await userRepo.userCount(user.id)
      expect(teamCount).toBe(1)
      expect(userCount).toBe(1)
    })
  })

  describe('userCount', () => {
    test('returns 0', async () => {
      const userRepo = queryRunner.manager.getCustomRepository(UserRepository)
      const userCount = await userRepo.userCount(123)
      expect(userCount).toBe(0)
    })
  })
})
