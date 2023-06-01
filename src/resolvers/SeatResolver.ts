import {
    Resolver,
    Mutation,
    Arg,
    Int,
    Query
} from "type-graphql";
import { Seat } from "../entity/Seat";
import { SeatStatus } from "../entity/SeatStatus";
import { In } from "typeorm"

@Resolver()
export class SeatResolver {
    @Mutation(() => Seat)
    async bookSeat(
        @Arg("cinema_id", () => Int) cinema_id: number,
        @Arg("seat_number", () => Int) seat_number: number
    ) {
        const result = await Seat.update({ cinema_id, seat_number, status: SeatStatus.EMPTY }, { status: SeatStatus.RESERVED })
        // if row gets updated find and return the updated seat...
        if (result.affected == 1) {
            const updated_seat = await Seat.find({ where: { cinema_id, seat_number } });
            return updated_seat[0]
        }
        throw new Error('Seat is not available.')
    }

    @Mutation(() => Seat)
    async book2consecutive(
        @Arg("cinema_id", () => Int) cinema_id: number
    ) {
        const seats = await Seat.find({ where: { cinema_id, status: SeatStatus.EMPTY }, order: { seat_number: "ASC" } })
        for (let index = 1; index < seats.length; index++) {
            if (seats[index - 1].seat_number + 1 === seats[index].seat_number) {
                // if 2 consecutive seats are avaliable reserve them and return updated seats
                const seat_number = seats[index - 1].seat_number;
                Seat.update({ cinema_id, seat_number: In([seat_number, seat_number + 1])}, { status: SeatStatus.RESERVED })
                return await Seat.find({where: {cinema_id, seat_number: In([seat_number, seat_number + 1])}})
            }
        }
        throw new Error('2 consecutive seats are not available.')
    }

    @Query(() => [Seat])
    getSeats() {
        return Seat.find();
    }
}
