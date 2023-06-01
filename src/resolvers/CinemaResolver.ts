import {
    Resolver,
    Mutation,
    Arg,
    Int,
    Query
} from "type-graphql";
import { Cinema } from "../entity/Cinema";
import { Seat } from "../entity/Seat";
import { SeatStatus } from "../entity/SeatStatus";

@Resolver()
export class CinemaResolver {
    @Mutation(() => Cinema)
    async createCinema(
        @Arg("title", () => String) title: string,
        @Arg("number_seats", () => Int) number_seats: number
    ) {
        const cinema = await Cinema.save({ title, number_seats });
        const seats = [];
        for (let seat_number = 1; seat_number <= number_seats; seat_number++) {
            seats.push(Seat.create({ cinema_id: cinema.id, seat_number: seat_number, status: SeatStatus.EMPTY }));
        }
        Seat.insert(seats);
        return cinema;
    }

    @Query(() => [Cinema])
    getCinemas() {
        return Cinema.find();
    }
}
