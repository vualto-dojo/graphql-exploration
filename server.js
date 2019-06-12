var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    user(id: ID!): User
    users: [User]
    usersByRole(role: String): [User]
  }

  type User {
      id: ID,
      name: String,
      age: Int,
      role: String
  }
`);

// The root provides a resolver function for each API endpoint
var root = {
  users: () => {
      return [{
        id: 123,
        name: "perry",
        age: 24,
        role: "admin"
    },
    {
        id: 124,
        name: "corrie",
        age: -23,
        role: "yet to be decided"
    },
    {
        id: 125,
        name: "lorenzo",
        age: 26,
        role: "morale officer"
    }]
  },
  usersByRole: ({ role })=> {
    let users = root.users();
    let filteredUsers = users.filter((user)=> { return user.role === role; });
    return filteredUsers;
  }
};

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');


// Query on: http://localhost:4000/graphql
// {
//   usersByRole(role: "admin") {
//     name
//     role
//   }
// }
