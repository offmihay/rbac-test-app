import { User } from 'src/users/entities/users.entity';
import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

export enum CardCategory {
  Birthday = 'birthday_greeting',
  Welcome = 'welcome_greeting',
  WorkAnniversary = 'work_anniversary_greeting',
  NewYear = 'new_year_holiday_greeting',
  CompanyAnniversary = 'company_anniversary_greeting',
  General = 'general',
}

export enum CardLanguage {
  English = 'english',
  German = 'german',
  Ukrainian = 'ukrainian',
}

@Entity('cards')
export class Card {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 300 })
  description: string;

  @Column()
  category: CardCategory;

  @Column()
  language: CardLanguage;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'publisherId' })
  publisher: User;

  @Column()
  publisherId: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ default: false })
  isApproved: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: false })
  isDeleted: boolean;
}
