require('dotenv/config')

module.exports = {
  "type": "postgres",
  "url": process.env.DATABASE_URL,
  "logging": false,
  "entities": [
     "build/entity/**/*.js"
  ],
  "migrations": [
     "build/migration/**/*.js"
  ],
  "subscribers": [
     "build/subscriber/**/*.js"
  ],
  "cli": {
     "entitiesDir": "src/entity",
     "migrationsDir": "src/migration",
     "subscribersDir": "src/subscriber"
  }
}
