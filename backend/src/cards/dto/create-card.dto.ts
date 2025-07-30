import { IsEnum, IsString, MaxLength } from 'class-validator';
import { CardCategory, CardLanguage } from '../entities/card.entity';

export class CreateCardDto {
  @IsString()
  @MaxLength(300)
  description: string;

  @IsEnum(CardCategory)
  category: CardCategory;

  @IsEnum(CardLanguage)
  language: CardLanguage;

  @IsString()
  imageUrl: string;
}
