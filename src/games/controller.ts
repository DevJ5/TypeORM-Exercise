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

@JsonController()
export default class GameController {
  @Get('/games')
  async getAllGames() {
    const games = await Game.find();
    if (!games) throw new BadRequestError();
    return { games };
  }

  @Post('/games')
  @HttpCode(201)
  addGame(@Body() game: Game) {
    if (!game.name) throw new BadRequestError();
    game.setNewColorAndBoard()
    return game.save();
  }

  @Put('/games/:id')
  async updateGame(@Body() game: Partial<Game>, @Param('id') id: number): Promise<Game> {
    if(!game) throw new BadRequestError()
    const currentGame = await Game.findOne(id);
    if(!currentGame) throw new BadRequestError()
    return Game.merge(currentGame, game).save()
  }
}
