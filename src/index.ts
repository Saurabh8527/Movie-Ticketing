import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { HelloWorldResolver } from "./resolvers/HelloWorldResolver";
import { CinemaResolver } from "./resolvers/CinemaResolver";
import { SeatResolver } from "./resolvers/SeatResolver";

(async () => {
    const app: any = express();

    await createConnection();

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloWorldResolver, CinemaResolver, SeatResolver]
        }),
        plugins: [ApolloServerPluginLandingPageGraphQLPlayground],
        context: ({ req, res }) => ({ req, res })
    });

    await apolloServer.start();

    apolloServer.applyMiddleware({ app, cors: false });

    app.listen(4000, () => {
        console.log("express server started");
    });
})();
