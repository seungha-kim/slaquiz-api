import 'dotenv/config'

import { UserRepository } from './repository/UserRepository'

import * as Koa from 'koa'
import * as bodyParser from 'koa-bodyparser'
import * as koaLogger from 'koa-logger'
import * as passport from 'koa-passport'
import * as Router from 'koa-router'
import { Strategy as SlackStrategy } from 'passport-slack'
import {createConnection} from 'typeorm'

const {
  SLACK_CALLBACK_URL,
  SLACK_CLIENT_ID,
  SLACK_CLIENT_SECRET,
  PORT,
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
  app.use(koaLogger())
  app.use(passport.initialize())
  app.use(bodyParser())
  const authRouter = new Router({
    prefix: '/auth',
  })
  authRouter.get('/text', (ctx) => {
    ctx.body = 'hello'
  })
  authRouter.get('/slack', passport.authorize('slack'))
  authRouter.get('/slack/callback', passport.authorize('slack'), (ctx) => {
    ctx.body = ctx.state.account
  })
  app.use(authRouter.routes())
  app.listen(PORT || 5000)
  console.log(`listening ${PORT}...`)
}).catch((error) => console.log(error))
