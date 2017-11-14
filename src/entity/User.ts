import 'reflect-metadata'

import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import Team from './Team'

export interface IUserFromSlack {
  slackId: string
  email: string
  name: string
}

@Entity()
export default class User implements IUserFromSlack {

  @PrimaryGeneratedColumn()
  public id: number

  @Column({unique: true})
  public slackId: string

  @Column()
  public email: string

  @Column()
  public name: string

  @Column({default: false})
  public isTeacher: boolean

  @Column()
  public teamId: number

  @ManyToOne((type) => Team, (team) => team.users, {nullable: false})
  public team: Team
}
