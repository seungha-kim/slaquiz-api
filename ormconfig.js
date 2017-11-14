require('reflect-metadata')
require('dotenv/config')

module.exports = {
  "type": "postgres",
  "url": process.env.NODE_ENV === "test" ? process.env.TEST_DATABASE_URL : process.env.DATABASE_URL,
  "logging": false,
  "entities": [
     "src/entity/**/*.ts"
  ],
  "migrations": [
     "src/migration/**/*.ts"
  ],
  "subscribers": [
     "src/subscriber/**/*.ts"
  ],
  "cli": {
     "entitiesDir": "src/entity",
     "migrationsDir": "src/migration",
     "subscribersDir": "src/subscriber"
  }
}
