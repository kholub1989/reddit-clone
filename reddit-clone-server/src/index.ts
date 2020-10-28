import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";

import microConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolvers } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolvers } from "./resolvers/user";

const main = async () => {
  const orm = await MikroORM.init(microConfig);
  await orm.getMigrator().up();
  const PORT = 4000;
  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolvers, PostResolver, UserResolvers],
      validate: false,
    }),
    context: () => ({ em: orm.em }),
  });

  apolloServer.applyMiddleware({ app });

  app.listen(PORT, () => {
    console.log(`server is running on localhost:${PORT}`);
  });
};
main().catch((err) => {
  console.error(err);
});
