import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, Unique, JoinColumn } from 'typeorm';
import { User } from 'src/users/entities/users.entity';
import { Card } from './card.entity';

@Entity('card_likes')
@Unique(['card', 'user'])
export class CardLike {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Card, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cardId' })
  card: Card;

  @Column()
  cardId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @CreateDateColumn()
  createdAt: Date;
}
