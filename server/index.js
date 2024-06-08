import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv'

import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';

import { buildContext } from 'graphql-passport'

import { connectDB } from './database/connect.js';
import passport from 'passport'
import session from 'express-session'
import connectMongo from 'connect-mongodb-session'

import { configurePassport } from './passport/passport.config.js'

import mergedTypeDef from './typeDefs/index.js';
import mergedResolver from './resolver/index.js';

dotenv.config();
configurePassport();

const app = express();
const httpServer = http.createServer(app);

const MongoDBStore = connectMongo(session)
const store = new MongoDBStore({
    uri: process.env.MONGO_URI,
    collection: 'session'
});
store.on(error, (err) => console.log(err));

app.use({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitilized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    },
    store: store
})

app.use(passport.initialize());
app.use(passport.session())

const server = new ApolloServer({
    typeDefs: mergedTypeDef,
    resolvers: mergedResolver,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();

app.use(
    '/',
    cors({
        origin: 'http://localhost:3000',
        credentials: true
    }),
    express.json(),
    expressMiddleware(server, {
        context: async ({ req, res }) => buildContext({ req, res }),
    }),
);

await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
await connectDB();
