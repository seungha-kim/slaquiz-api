import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Team } from "./Team";

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  public id: number;

  @Column({unique: true})
  public slackId: string;

  @Column()
  public email: string;

  @Column()
  public name: string;

  @ManyToOne((type) => Team, {nullable: false})
  public team: Team;
}
