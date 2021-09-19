require('dotenv').config();
import 'reflect-metadata';
import express from 'express';
import { createConnection } from 'typeorm';
import { User } from './entities/User';
import { Product } from './entities/Product';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql'
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core'
import { HelloResolver } from './resolvers/hello'
import { UserResolver } from './resolvers/user'

const main = async () => {
  await createConnection({
    type: 'postgres',
    database: 'racroishop',
    username: process.env.DB_USERNAME_DEV,
    password: process.env.DB_PASSWORD_DEV,
    logging: true,
    synchronize: true,
    entities: [User, Product],
  });

  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
			resolvers: [HelloResolver, UserResolver],
			validate: false
		}),
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()]
  })

  await apolloServer.start()

  apolloServer.applyMiddleware({app, cors: false})

  const PORT = process.env.PORT || 4000

  app.listen(PORT, () => console.log(`Server started on port ${PORT}. Graphql server start on localhost:${PORT}/graphql`));
};

main().catch((err) => console.error(err));
