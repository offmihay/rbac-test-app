import { Exclude } from 'class-transformer';
import { CardLike } from 'src/cards/entities/card-like.entity';
import Role from 'src/common/enums/role.enum';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ nullable: true })
  fullName: string;

  @Column({ type: 'date', nullable: true })
  dateOfBirth: Date;

  @Column({ type: 'enum', enum: Role, default: Role.VISITOR })
  role: Role;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => CardLike, (like) => like.user)
  likes: CardLike[];
}
