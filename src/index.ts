import "reflect-metadata";
import express from 'express';
import {ApolloServer} from 'apollo-server-express';
import {buildSchema} from 'type-graphql';
import { AnimalResolver, NoteResolver, PostResolver, UserResolver, ZipcodeResolver, RefCategoryResolver, RefItemResolver } from "./resolvers/";
// import { TodoResolver } from "./resolvers/"; //MongoDB
import session from 'express-session';
import { COOKIE_NAME, __prod__ } from "./constants";
import cors from 'cors'

import Redis from "ioredis";
import connectRedis from "connect-redis";

const main = async () => {

    const app = express();

    const RedisStore = connectRedis(session);
    // const redis = new Redis(process.env.REDIS_URL);
    const redis = new Redis("127.0.0.1:6379");
    app.set("trust proxy", 1);

    app.use(
        cors({
            origin: "http://localhost:3000",
            credentials: true,
        })
    );

    app.use(
    session({
        name: COOKIE_NAME,
        store: new RedisStore({ 
            client: redis,
            disableTouch: true 
        }),
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
            httpOnly: true,
            sameSite: 'lax', //csrf
            // secure: __prod__ // cookie only works in https
        },
        saveUninitialized: false,
        secret: "areaklkerklaeieileiaiwe",
        resave: true,
    })
    )

    // cors: {
    //     origin: ["https://www.your-app.example", "https://studio.apollographql.com"]
    // },

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [AnimalResolver, PostResolver, UserResolver, NoteResolver, ZipcodeResolver, RefCategoryResolver, RefItemResolver ],
            validate: false
        }),
        csrfPrevention: false,  // see below for more about this
        context: ({ req, res }) => ({ req, res, redis }),
    });

    await apolloServer.start();
    
    apolloServer.applyMiddleware({ 
        app, 
        cors: false, 
    });

    app.listen(4000, ()=> {
        console.log('server started on localhost:4000');
    }
    )
}

main().catch(err => {
    console.log(err);
})

