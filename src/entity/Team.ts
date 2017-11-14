import 'reflect-metadata'
import User from './User'

import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

export interface ITeamFromSlack {
  slackId: string
  name: string
}

@Entity()
export default class Team implements ITeamFromSlack {

  @PrimaryGeneratedColumn()
  public id: number

  @Column({unique: true})
  public slackId: string

  @Column()
  public name: string

  @OneToMany((type) => User, (user) => user.team)
  public users: User[]
}
