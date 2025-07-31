import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
  Put,
  Patch,
  Query,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import Role from 'src/common/enums/role.enum';
import { RequestWithUser } from 'src/common/types/jwt-user.type';
@Controller('cards')
@UseInterceptors(ClassSerializerInterceptor)
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.PUBLISHER)
  @Post()
  create(@Body() createCardDto: CreateCardDto, @Req() req: RequestWithUser) {
    return this.cardsService.create(createCardDto, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  @Roles(Role.PUBLISHER)
  findAll(@Req() req: RequestWithUser) {
    return this.cardsService.findAll(req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('active')
  findActive() {
    return this.cardsService.findActive();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.PUBLISHER)
  @Get('awaiting')
  findAwaiting(@Req() req: RequestWithUser) {
    return this.cardsService.findAwaiting(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cardsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.PUBLISHER)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateCardDto: UpdateCardDto, @Req() req: RequestWithUser) {
    return this.cardsService.update(id, updateCardDto, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.PUBLISHER)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.cardsService.delete(id, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch(':id/approve')
  async approveCard(@Param('id') id: string, @Query('isApproved') isApproved: string) {
    const value = isApproved === 'true';
    return this.cardsService.approve(id, value);
  }
}
