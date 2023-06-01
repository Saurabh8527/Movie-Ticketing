import {
    Resolver,
    Mutation,
    Arg,
    Int,
    Query
} from "type-graphql";
import { Seat } from "../entity/Seat";
import { SeatStatus } from "../entity/SeatStatus";

@Resolver()
export class SeatResolver {
    @Mutation(() => Boolean)
    async bookSeat(
        @Arg("cinema_id", () => Int) cinema_id: number,
        @Arg("seat_number", () => Int) seat_number: number
    ) {
        const result = await Seat.update({ cinema_id, seat_number, status: SeatStatus.EMPTY }, { status: SeatStatus.RESERVED })
        console.log(result)
        return result.affected == 1
    }

    @Query(() => [Seat])
    getSeats() {
        return Seat.find();
    }
}
