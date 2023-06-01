import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { HelloWorldResolver } from "./resolvers/HelloWorldResolver";
import { CinemaResolver } from "./resolvers/CinemaResolver";
import { SeatResolver } from "./resolvers/SeatResolver";
const cluster = require('cluster');
const os = require('os');

(async () => {

    if (cluster.isMaster) {
        const numCPUs = os.cpus().length;

        console.log(`Master process is running with PID ${process.pid}`);
        console.log(`Forking ${numCPUs} worker processes...`);

        // Fork worker processes
        for (let i = 0; i < numCPUs; i++) {
            cluster.fork();
        }

        // Handle worker process events
        cluster.on('fork', (worker: any) => {
            console.log(`Worker ${worker.process.pid} is forked.`);
        });

        cluster.on('online', (worker: any) => {
            console.log(`Worker ${worker.process.pid} is online.`);
        });

        cluster.on('listening', (worker: any, address: any) => {
            console.log(`Worker ${worker.process.pid} is listening on ${address.address}:${address.port}.`);
        });

        cluster.on('exit', (worker: any, code: any, signal: any) => {
            console.log(`Worker ${worker.process.pid} exited with code ${code} and signal ${signal}.`);
            console.log('Forking a new worker...');
            cluster.fork();
        });
    } else {
        console.log(`Worker process ${process.pid} is running.`);
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

        const port = 4000 + cluster.worker.id;
        app.listen({ port }, () => {
            console.log("express server started");
        });
    }
})();
