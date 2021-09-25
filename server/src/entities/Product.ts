import { Field, ID, ObjectType } from 'type-graphql'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { Category } from './Category'

@ObjectType()
@Entity()
export class Product extends BaseEntity {
  @Field(_type => ID)
  @PrimaryGeneratedColumn()
  id!: number

  @Field()
  @Column()
  title!: string

  @Field()
  @Column()
  price!: number

  @Field()
  @Column()
  description!: string

  @Field()
  @Column()
  categoryId!: number

  @Field(_type => Category)
  @ManyToOne(() => Category, category => category.products)
  category: Category

  @Field()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date

  @Field()
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date
}
