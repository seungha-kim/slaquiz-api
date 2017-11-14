import gql from 'graphql-tag'
import { makeExecutableSchema } from 'graphql-tools'
import { getConnection } from 'typeorm'
import { UserRepository } from './repository/UserRepository'

export const typeDefs = gql`
type User {
  id: Int!
  name: String!
  team: Team!
}

type Team {
  id: Int!
  name: String!
  users: [User!]!
}

type Query {
  user: User
}
`

export const resolvers = {
  Query: {
    user: (obj, args, context) => {
      const connection = getConnection()
      const userRepo = connection.getCustomRepository(UserRepository)
      return userRepo.findUserById(context.userId)
    },
  },
  Team: {
    users: (obj) => {
      const connection = getConnection()
      const userRepo = connection.getCustomRepository(UserRepository)
      return userRepo.findUsersByTeamId(obj.id)
    },
  },
}

export default makeExecutableSchema({
  resolvers,
  typeDefs,
})
