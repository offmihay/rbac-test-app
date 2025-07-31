import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Card } from './entities/card.entity';
import { Repository } from 'typeorm';
import { JwtUser } from 'src/common/types/jwt-user.type';
import { Role } from 'src/common/enums/role.enum';
import { CardLike } from './entities/card-like.entity';

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(Card) private cardsRepo: Repository<Card>,
    @InjectRepository(CardLike) private cardLikesRepo: Repository<CardLike>,
  ) {}
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

  async findActive(user: JwtUser): Promise<Omit<Card, 'likes'>[]> {
    const cards = await this.cardsRepo.find({
      where: { isDeleted: false, isApproved: true },
      order: { createdAt: 'DESC' },
      relations: ['likes'],
    });
    const newCards = cards.map((card) => {
      const { likes, ...rest } = card;
      return { ...rest, isLiked: !!likes.find((like) => like.userId === user.userId), likeCount: likes.length };
    });

    return newCards;
  }

  async findAwaiting(user: JwtUser): Promise<Card[]> {
    if (user.role === Role.PUBLISHER) {
      return await this.cardsRepo.find({
        where: { isDeleted: false, isApproved: false, publisherId: user.userId },
        order: { createdAt: 'DESC' },
      });
    }
    return await this.cardsRepo.find({ where: { isDeleted: false, isApproved: false }, order: { createdAt: 'DESC' } });
  }

  async findUsersCards(user: JwtUser): Promise<Omit<Card, 'likes'>[]> {
    const cards = await this.cardsRepo.find({
      where: { isDeleted: false, publisherId: user.userId },
      order: { createdAt: 'DESC' },
      relations: ['likes'],
    });

    const newCards = cards.map((card) => {
      const { likes, ...rest } = card;
      return { ...rest, isLiked: !!likes.find((like) => like.userId === user.userId), likeCount: likes.length };
    });
    return newCards;
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

  async toggleLike(id: string, user: JwtUser): Promise<{ message: string }> {
    const card = await this.findById(id);
    if (!card) {
      throw new NotFoundException('Card not found');
    }
    const existingLike = await this.cardLikesRepo.findOne({
      where: {
        cardId: id,
        userId: user.userId,
      },
    });
    if (existingLike) {
      await this.cardLikesRepo.delete(existingLike.id);
    } else {
      const like = this.cardLikesRepo.create({ cardId: card.id, userId: user.userId });
      await this.cardLikesRepo.save(like);
    }
    return { message: 'Like successfully toggled' };
  }
}
