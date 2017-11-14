import 'reflect-metadata';

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export interface ITeamFromSlack {
  slackId: string;
  name: string;
}

@Entity()
export default class Team implements ITeamFromSlack {

  @PrimaryGeneratedColumn()
  public id: number;

  @Column({unique: true})
  public slackId: string;

  @Column()
  public name: string;
}
