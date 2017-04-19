# Sequelize

Sequelize is a promise-based Node.js ORM for Postgres, MySQL, SQLite and Microsoft SQL Server. It features solid transaction support, relations, read replication and more.

## Migrations
Table creation uses the migration scripts located under `/dba/migrations`.

1. Install `sequelize-cli` globally using the command `npm install -g sequelize-cli`.
2. Make sure the database URL is available as the environment variable, set as `DATABASE_URL`.
3. Run `sequelize db:migrate` to create the tables.

## Seeders
Seeders, the data that will populate the database, are located under `/dba/seeders`.
To run the seeders, run `sequelize db:seed:all`.
## Models
Models are a JavaScript factory class that represents a table in the database. Models are located under `/src/models`.
