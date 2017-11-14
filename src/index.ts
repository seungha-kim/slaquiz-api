import 'dotenv/config';
import 'reflect-metadata';

import { Team } from './entity/Team';
import { User } from './entity/User';

import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as koaLogger from 'koa-logger';
import * as passport from 'koa-passport';
import * as Router from 'koa-router';
import { Strategy as SlackStrategy } from 'passport-slack';
import {createConnection} from 'typeorm';

createConnection().then(async (connection) => {
  passport.use(new SlackStrategy({
    callbackURL: process.env.SLACK_CALLBACK_URL,
    clientID: process.env.SLACK_CLIENT_ID,
    clientSecret: process.env.SLACK_CLIENT_SECRET,
  }, async (accessToken, refreshToken, profile, done) => {
    const { manager } = connection;

    const team = await manager.findOne(Team, {
      slackId: profile.team.id,
    }) || new Team();
    manager.merge(Team, team, {
      name: profile.team.name,
      slackId: profile.team.id,
    });
    await manager.save(team);

    const user = await manager.findOne(User, {
      slackId: profile.user.id,
    }) || new User();
    manager.merge(User, user, {
      email: profile.user.email,
      name: profile.user.name,
      slackId: profile.user.id,
      team,
    });
    await manager.save(user);

    done(null, profile);
  }));

  const app = new Koa();
  app.use(koaLogger());
  app.use(passport.initialize());
  app.use(bodyParser());
  const authRouter = new Router({
    prefix: '/auth',
  });
  authRouter.get('/text', (ctx) => {
    ctx.body = 'hello';
  });
  authRouter.get('/slack', passport.authorize('slack'));
  authRouter.get('/slack/callback', passport.authorize('slack'), (ctx) => {
    ctx.body = ctx.state.account;
  });
  app.use(authRouter.routes());
  app.listen(3000);
}).catch((error) => console.log(error));
