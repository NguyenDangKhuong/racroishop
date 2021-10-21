//type script voi graphql
import { Field, ID, ObjectType } from 'type-graphql'
// type script voi postgre
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { Like } from './Like'
import { Product } from './Product'

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(_type => ID)
  @PrimaryGeneratedColumn()
  id!: number

  @Field()
  @Column({ unique: true })
  username!: string

  @Field()
  @Column({ unique: true })
  email!: string

  @Field()
  @Column()
  role!: number

  @Column()
  password!: string

  @OneToMany(() => Product, product => product.user)
  products: Product[]

  @OneToMany(_to => Like, like => like.user)
  likes: Like[]

  @Field()
  @CreateDateColumn()
  createdAt: Date

  @Field()
  @UpdateDateColumn()
  updatedAt: Date
}
