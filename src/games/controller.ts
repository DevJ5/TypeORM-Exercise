// src/games/controller.ts
import {
  JsonController,
  Get,
  Param,
  Put,
  Body,
  Post,
  BadRequestError,
  HttpCode
} from 'routing-controllers';
import Game from './entity';

interface GameObject {
  name: string;
  color: string;
  board: string[][];
}

@JsonController()
export default class GameController {
  @Get('/games')
  async getAllGames(): Promise<Object> {
    const games = await Game.find();
    if (!games) throw new BadRequestError();
    return { games };
  }

  @Post('/games')
  @HttpCode(201)
  addGame(@Body() game: Game): Promise<GameObject> {
    if (!game.name) throw new BadRequestError();
    const newGame = Game.create({
      name: game.name,
      color: this.setRandomColor(),
      board: this.setNewBoard()
    });

    return newGame.save();
  }

  @Put('/games/:id')
  async updateGame(
    @Body() game: Partial<Game>,
    @Param('id') id: number
  ): Promise<GameObject> {
    const currentGame = await Game.findOne(id);
    if (!currentGame) throw new BadRequestError();
    if (game.color && !this.validateColor(game.color))
      throw new BadRequestError();
    if (game.board && !this.validateBoard(currentGame.board, game.board))
      throw new BadRequestError();
    return Game.merge(currentGame, game).save();
  }

  setRandomColor(): string {
    const colors = ['red', 'blue', 'green', 'yellow', 'magenta'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    return randomColor;
  }

  setNewBoard(): string[][] {
    return [['o', 'o', 'o'], ['o', 'o', 'o'], ['o', 'o', 'o']];
  }

  validateColor(color: string): boolean {
    const colors = ['red', 'blue', 'green', 'yellow', 'magenta'];
    if (colors.includes(color)) return true;
    return false;
  }

  validateBoard(currentBoard: string[][], newBoard: string[][]): boolean {
    const moves = currentBoard
      .map((row, y) => row.filter((cell, x) => newBoard[y][x] !== cell))
      .reduce((a, b) => a.concat(b)).length;

    if (moves === 1) return true;
    return false;
  }
}
