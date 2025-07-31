import { Module } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { Card } from './entities/card.entity';
import { CardLike } from './entities/card-like.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Card, CardLike])],
  controllers: [CardsController],
  providers: [CardsService],
})
export class CardsModule {}
