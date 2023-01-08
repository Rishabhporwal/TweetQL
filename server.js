import { ApolloServer, gql } from "apollo-server";

let tweets = [
  {
    id: "1",
    text: "Hello-1",
    userId: "2",
  },
  {
    id: "2",
    text: "Hell0-2",
    userId: "2",
  },
  {
    id: "3",
    text: "Hello-3",
    userId: "1",
  },
];

let users = [
  {
    id: "1",
    firstname: "Rishabh",
    lastname: "Porwal",
  },
  {
    id: "2",
    firstname: "Ritansha",
    lastname: "Porwal",
  },
  {
    id: "3",
    firstname: "Mohan",
    lastname: "Dhanotiya",
  },
];

// GET /allTweets
// GET /tweet/:id

const typeDefs = gql`
  type User {
    id: ID!
    firstname: String!
    lastname: String!
    fullname: String!
  }
  type Tweet {
    id: ID!
    text: String!
    author: User!
  }

  type Query {
    allUsers: [User!]!
    allTweets: [Tweet!]!
    tweet(id: ID!): Tweet
    ping: String!
  }

  type Mutation {
    postTweet(text: String!, userId: ID!): Tweet!
    deleteTweet(id: ID!): Boolean!
  }
`;

const resolvers = {
  Query: {
    allUsers() {
      console.log("All User Called");
      return users;
    },
    allTweets() {
      return tweets;
    },
    tweet(root, args) {
      console.log(root);
      return tweets.find((tweet) => tweet.id === args.id);
    },
  },
  Mutation: {
    postTweet(_, args) {
      const newTweet = {
        id: tweets.length + 1,
        text: args.text,
        userId: args.userId,
      };
      tweets.push(newTweet);
      return newTweet;
    },
    deleteTweet(_, args) {
      const tweet = tweets.find((tweet) => tweet.id === args.id);
      if (!tweet) return false;
      tweets = tweets.filter((tweet) => tweet.id === args.id);
      return true;
    },
  },
  User: {
    firstname({ firstname }) {
      return firstname + "- 1";
    },
    fullname(root) {
      return `${root.firstname} ${root.lastname}`;
    },
  },
  Tweet: {
    author(root) {
      console.log(root);
      return users.find((user) => user.id === root.userId);
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });
server.listen().then(({ url }) => {
  console.log(`Server running on ${url} `);
});
