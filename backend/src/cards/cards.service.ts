import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Card } from './entities/card.entity';
import { Repository } from 'typeorm';
import { JwtUser } from 'src/common/types/jwt-user.type';
import { Role } from 'src/common/enums/role.enum';

@Injectable()
export class CardsService {
  constructor(@InjectRepository(Card) private cardsRepo: Repository<Card>) {}
  private async findById(id: string): Promise<Card | null> {
    return this.cardsRepo.findOne({ where: { id, isDeleted: false } });
  }

  private async getCardCheckOwnership(cardId: string, user: JwtUser): Promise<Card> {
    const card = await this.findById(cardId);
    if (!card) {
      throw new NotFoundException('Card not found');
    }
    if (user.role !== Role.ADMIN && card.publisherId !== user.userId) {
      throw new ForbiddenException('You can only manage your own cards');
    }
    return card;
  }

  async findOne(id: string): Promise<Card> {
    const card = await this.findById(id);
    if (!card) {
      throw new NotFoundException('Card not found');
    }
    return card;
  }

  async create(createCardDto: CreateCardDto, user: JwtUser) {
    const card = this.cardsRepo.create({ ...createCardDto, publisherId: user.userId });
    return this.cardsRepo.save(card);
  }

  async findActive(): Promise<Card[]> {
    return this.cardsRepo.find({ where: { isDeleted: false, isApproved: true } });
  }

  async findAll(user: JwtUser): Promise<Card[]> {
    if (user.role === Role.ADMIN) {
      return this.cardsRepo.find({ where: { isDeleted: false } });
    }

    return this.cardsRepo.find({ where: { isDeleted: false, publisherId: user.userId } });
  }

  async update(id: string, updateCardDto: UpdateCardDto, user: JwtUser): Promise<Card> {
    const existingCard = await this.getCardCheckOwnership(id, user);
    return await this.cardsRepo.save({ ...existingCard, ...updateCardDto });
  }

  async delete(id: string, user: JwtUser): Promise<Card> {
    const existingCard = await this.getCardCheckOwnership(id, user);
    existingCard.isDeleted = true;
    return this.cardsRepo.save(existingCard);
  }

  async approve(id: string, isApproved: boolean): Promise<Card> {
    const card = await this.findById(id);
    if (!card) {
      throw new NotFoundException('Card not found');
    }
    card.isApproved = isApproved;
    return this.cardsRepo.save(card);
  }
}
