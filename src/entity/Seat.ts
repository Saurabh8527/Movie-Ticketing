import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";
import { Field, Int, ObjectType } from "type-graphql";
import { SeatStatus } from "./SeatStatus";

@ObjectType()
@Entity()
export class Seat extends BaseEntity {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id: number;

    @Field(() => Int)
    @Column()
    cinema_id: number;

    @Field(() => Int)
    @Column()
    seat_number: number;

    @Field()
    @Column()
    status: SeatStatus;
}
