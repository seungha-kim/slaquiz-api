import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Team {

  @PrimaryGeneratedColumn()
  public id: number;

  @Column({unique: true})
  public slackId: string;

  @Column()
  public name: string;
}
