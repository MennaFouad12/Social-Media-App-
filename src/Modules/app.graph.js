// import { GraphQLObjectType,GraphQLSchema,GraphQLString } from "graphql";
  
//   import * as postController from "./Post/graph/post.graph.controller.js"
//   export const schema=new GraphQLSchema({
//     query:new GraphQLObjectType({
//       name:"socialAppQuery",
//       description:"main app query",
//       fields:{
//         ...postController.query
//       }
//     }),

//     mutation:new GraphQLObjectType({
//       name:"socialAppMutation",
//       description:"main app mutation",
//       fields:{
//         ...postController.mutation
//       }
//   })
// })

import { GraphQLObjectType, GraphQLSchema } from "graphql";
import * as postController from "./Post/graph/post.graph.controller.js";



export const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "socialAppQuery",
    description: "Main app query",
    fields: () => ({
      
      ...postController.query, // This ensures fields are evaluated at runtime
    }),
  }),

  mutation: new GraphQLObjectType({
    name: "socialAppMutation",
    description: "Main app mutation",
    fields: () => ({
      ...postController.mutation,
    }),
  }),
});
  