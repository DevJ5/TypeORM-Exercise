import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { BaseEntity } from 'typeorm/repository/BaseEntity';
import { IsString, Length, MinLength } from 'class-validator';

@Entity()
export default class Game extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @IsString()
  @Length(5, 25)
  @Column('text')
  name: string;

  //@IsString()
  @Column('text')
  color: string;

  // @IsString()
  // @MinLength(10)
  @Column('json')
  board: string[][];

  setNewColorAndBoard() {
    const colors = ['red', 'blue', 'green', 'yellow', 'magenta'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    this.color = randomColor;
    this.board = [['o', 'o', 'o'], ['o', 'o', 'o'], ['o', 'o', 'o']];
  }

  validateColor(color) {
    const colors = ['red', 'blue', 'green', 'yellow', 'magenta'];
    if(colors.includes(color)) return true
    return false;
  }
}
