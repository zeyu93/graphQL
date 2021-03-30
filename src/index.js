import { GraphQLServer } from "graphql-yoga";
import gql from "graphql-tag";
// Type definitions

// Scalar types - String, boolean, int ,Float , id

// it is application schema, what data looks liek and the operations it can perfrom
const typeDefs = gql`
  type Query {
    me: User!
    post: Post!
    users: [User!]!
    posts(query: String): [Post!]!
    comments: [Comment]!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
    comments: [Comment!]!
  }
  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
    comments: [Comment]!
  }
  type Comment {
    id: ID!
    text: String!
    author: User!
    post: Post!
  }
`;

const sampleUserData = [
  {
    id: "1",
    name: "andrew",
    email: "haozai_03@hotmail.com",
    age: 50,
    posts: [],
  },
  { id: "2", name: "dime", email: "gmail@hotmail.com", posts: [] },
  { id: "3", name: "john", email: "zeyu@hotmail.com", posts: [] },
];

const samplePostsData = [
  {
    id: "1",
    title: "To Kill a Mock",
    body: "hey",
    published: false,
    author: "1",
  },
  {
    id: "2",
    title: "TOPSHOT",
    body: "hey where are my moments",
    published: true,
    author: "2",
  },
  {
    id: "3",
    title: "johnny",
    body: "where is johnny??",
    published: false,
    author: "3",
  },
  {
    id: "4",
    title: "New Post",
    body: "where is me??",
    published: true,
    author: "1",
  },
];

const sampleCommentsData = [
  { id: "1", author: "1", text: "gtdo!", post: "1" },
  { id: "2", author: "1", text: "where are u!", post: "2" },
  { id: "3", author: "2", text: "happy!", post: "3" },
  { id: "4", author: "3", text: "fuckkkkk!", post: "2" },
];

// Resolvers
// how to retreieve the data
const resolvers = {
  Query: {
    me() {
      return {
        id: "123abc",
        name: "Mike",
        email: "mike@gmail.com",
      };
    },
    post() {
      return {
        id: "12321as",
        title: "To Kill a Mock",
        body: "hey",
        published: false,
      };
    },
    users(parent, args, ctx, info) {
      return sampleUserData;
    },
    posts(parent, args, ctx, info) {
      if (!args.query) {
        return samplePostsData;
      }

      return samplePostsData.filter(
        (post) =>
          post.title.includes(args.query) || post.body.includes(args.query)
      );
    },
    comments(parent, args, ctx, info) {
      return sampleCommentsData;
    },
  },
  Post: {
    author(parent, args, ctx, info) {
      return sampleUserData.find((user) => parent.author === user.id);
    },
    comments(parent, args, ctx, info) {
      return sampleCommentsData.filter((comment) => comment.post === parent.id);
    },
  },
  User: {
    //   parent in this case is the User object that is calling
    posts(parent, args, ctx, info) {
      return samplePostsData.filter((post) => parent.id === post.author);
    },
    comments(parent, args, ctx, info) {
      return sampleCommentsData.filter(
        (comment) => comment.author === parent.id
      );
    },
  },
  Comment: {
    author(parent, args, ctx, info) {
      return sampleUserData.find((user) => user.id === parent.author);
    },
    post(parent, args, ctx, info) {
      return samplePostsData.find((post) => post.id === parent.author);
    },
  },
};

const server = new GraphQLServer({
  typeDefs,
  resolvers,
});

server.start(() => {
  console.log("server running");
});
