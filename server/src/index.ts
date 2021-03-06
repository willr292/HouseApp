import "reflect-metadata";
import { COOKIE_NAME, _prod_ } from "./constants";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import cors from "cors";
import Redis from "ioredis";
import session from "express-session";
import connectRedis from "connect-redis";
import { createConnection } from "typeorm";
import path from "path";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import { Post } from "./entities/Post";
import { Upvote } from "./entities/Upvote";
import { User } from "./entities/User";

const main = async () => {
  const conn = await createConnection({
    type: "postgres",
    database: "HouseApp",
    username: "postgres",
    password: "postgres",
    logging: true,
    synchronize: true,
    migrations: [path.join(__dirname, "./migrations/*")],
    entities: [User, Post, Upvote],
  });
  //await Post.delete({});
  //await conn.runMigrations();
  const app = express();

  const RedisStore = connectRedis(session);
  const redis = new Redis();

  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    }),
  );

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
        httpOnly: true,
        sameSite: "lax",
        secure: _prod_,
      },
      saveUninitialized: true,
      secret: "secretmcsecretface",
      resave: false,
    }),
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver, PostResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({ req, res, redis }),
  });

  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(4000, () => {
    console.log("server started on localhost:4000");
  });
};

main().catch((err) => {
  console.error(err);
});
