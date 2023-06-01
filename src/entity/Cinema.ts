import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";
import { Field, Int, ObjectType } from "type-graphql";
import { Seat } from "./Seat";

@ObjectType()
@Entity()
export class Cinema extends BaseEntity {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column()
    title: string;

    @Field(() => Int)
    @Column()
    number_seats: number;

    seats: [Seat]
}
