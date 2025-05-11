import { ApolloServer } from "apollo-server-express";
import { addResolversToSchema } from "@graphql-tools/schema";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { getSchema } from "../graphQL/schemaBuilder.js";
import { createResolvers } from "../graphQL/gplResolvers.js";

dotenv.config({
    path: "../.env",
});

const setupApolloServer = async (userClient, productClient, orderClient) => {
    const schema = await getSchema();
    const resolvers = createResolvers(userClient, productClient, orderClient);

    return new ApolloServer({
        schema: addResolversToSchema({
            schema,
            resolvers,
        }),
        context: async ({ req }) => {
            if (!req.headers.authorization) {
                return { user: null };
            }
            const token = req.headers.authorization.replace("Bearer ", "");
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                return { user: decoded };
            } catch (err) {
                console.error("Token verification error: ", err);
                return { user: null };
            }
        },
    });
};

export default setupApolloServer;
