import { graphiqlKoa, graphqlKoa } from 'apollo-server-koa'
import * as debug from 'debug'
import 'dotenv/config'
import * as jwt from 'jsonwebtoken'
import * as Koa from 'koa'
import * as bodyParser from 'koa-bodyparser'
import * as koaJwt from 'koa-jwt'
import * as koaLogger from 'koa-logger'
import * as passport from 'koa-passport'
import * as Router from 'koa-router'
import { Strategy as SlackStrategy } from 'passport-slack'
import {createConnection} from 'typeorm'
import { ConnectionOptions } from 'typeorm/connection/ConnectionOptions'

import Team from './entity/Team'
import User from './entity/User'
import schema from './gqlSchema'
import { UserRepository } from './repository/UserRepository'

const log = debug('slaquiz:index')
const {
  NODE_ENV,
  SLACK_CALLBACK_URL,
  SLACK_CLIENT_ID,
  SLACK_CLIENT_SECRET,
  PORT,
  JWT_SECRET,
  TARGET_ORIGIN,
} = process.env

interface ISlackProfile {
  user: {
    email: string,
    name: string,
    id: string,
  }
  team: {
    name: string,
    id: string,
  }
}

const authRouter = new Router({
  prefix: '/auth',
})
authRouter.get('/slack', passport.authorize('slack'))
authRouter.get('/slack/callback', passport.authorize('slack'), (ctx) => {
  log(ctx.state.account)
  const token = jwt.sign({id: ctx.state.account.id}, JWT_SECRET)
  const targetOrigin = NODE_ENV === 'production' ? TARGET_ORIGIN : '*'
  ctx.body = `<script>window.opener.postMessage('${token}', '${targetOrigin}')</script>`
})

const graphqlRouter = new Router()
graphqlRouter.use(koaJwt({secret: JWT_SECRET}))
graphqlRouter.all('/graphql', graphqlKoa((ctx) => {
  return {
    context: {userId: ctx.state.user.id},
    schema,
  }
}))
graphqlRouter.get('/graphiql', graphiqlKoa({endpointURL: '/graphql'}))

createConnection().then(async (connection) => {
  passport.use(new SlackStrategy({
    callbackURL: SLACK_CALLBACK_URL,
    clientID: SLACK_CLIENT_ID,
    clientSecret: SLACK_CLIENT_SECRET,
  }, async (accessToken: string, refreshToken: string, profile: ISlackProfile, done) => {
    const { manager } = connection
    const userRepo = manager.getCustomRepository(UserRepository)
    const {team, user} = await userRepo.firstOrCreateTeamAndUser({
      name: profile.team.name,
      slackId: profile.team.id,
    }, {
      email: profile.user.email,
      name: profile.user.name,
      slackId: profile.user.id,
    })

    done(null, user)
  }))

  const app = new Koa()
    .use(koaLogger())
    .use(passport.initialize())
    .use(bodyParser())
    .use(authRouter.routes())
    .use(authRouter.allowedMethods())
    .use(graphqlRouter.routes())
    .use(graphqlRouter.allowedMethods())
    .listen(PORT || 5000)

  console.log(`listening ${PORT}...`)
}).catch((error) => console.log(error))
