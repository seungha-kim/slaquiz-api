import { EntityManager, EntityRepository } from 'typeorm';
import Team, { ITeamFromSlack } from '../entity/Team';
import User, { IUserFromSlack } from '../entity/User';

@EntityRepository()
export class UserRepository {
  constructor(private manager: EntityManager) {}

  public async firstOrCreateTeamAndUser(teamWithoutId: ITeamFromSlack, userWithoutId: IUserFromSlack) {
    let firstUserInTeam = false;
    const team = await this.manager.findOne(Team, {
      slackId: teamWithoutId.slackId,
    }) || new Team();

    firstUserInTeam = team.id == null;

    this.manager.merge(Team, team, {
      name: teamWithoutId.name,
      slackId: teamWithoutId.slackId,
    });
    await this.manager.save(team);

    const user = await this.manager.findOne(User, {
      slackId: userWithoutId.slackId,
    }) || new User();
    this.manager.merge(User, user, {
      email: userWithoutId.email,
      isTeacher: firstUserInTeam,
      name: userWithoutId.name,
      slackId: userWithoutId.slackId,
      team,
    });
    await this.manager.save(user);

    return {team, user};
  }

  public async userCount(id: number): Promise<number> {
    const { count } = await this.manager.createQueryBuilder()
      .select('COUNT(*)', 'count')
      .from(User, 'user')
      .getRawOne();
    return parseInt(count, 10);
  }

  public async teamCount(id: number): Promise<number> {
    const { count } = await this.manager.createQueryBuilder()
      .select('COUNT(*)', 'count')
      .from(Team, 'team')
      .getRawOne();
    return parseInt(count, 10);
  }
}
