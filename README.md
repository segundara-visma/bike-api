# Bike API - Simple API for Helsinki Bike usage.

[![github-shield]][github-url]
[![Issues][issues-shield]][issues-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

---

## Introduction[![](./src/assets/images/pin.jpg)](#introduction)

This personal project is just a simple backend service for Helsinki Bike usage. It made use of apollo server express with graphql to build a GraphQL API, mysql as the database and sequelize as the ORM to communicate with the database and Jest for testing.

---

## Prerequisites[![](./src/assets/images/pin.jpg)](#prerequisites)
You need to have following programs installed:
| Program | URL | Description |
| --- | --- | --- |
| Node.js | https://nodejs.org/en/ | JavaScript runtime. The whole project is based on Node.js. |
| NPM | https://www.npmjs.com | Node package manager for installing different dependencies |
| MySql | https://www.mysql.com/ | A database engine for the project |

---

## Pre-commit hook[![](./src/assets/images/pin.jpg)](#pre-commit-hook)

[Husky](https://typicode.github.io/husky/#/) is used to handle pre-commit test of code against the already pre-defined **ESLint** config before commit to **GIT**. This will automatically check the codes before every commit so as to help with code style consistency.

---

## Project setup[![](./src/assets/images/pin.jpg)](#project-setup)

***Clone the repo.***
```
git clone https://github.com/segundara-visma/bike-api.git
```

***Copy environment variable file and fill in your environment values.***
```
cp .env.example .env
```

***Install project's dependencies with npm.***
```
npm install
```

***Run setup script.***
```
npm run setup --seed
```

The npm command runs a setup file, which is located in `./setup/index,js`. It will take care of the following setup process.

- Check that the required environment variables are set. The process exits if there are any errors.
- Create a file for Sequelize CLI at `./src/config/sequelize-cli.config.json`.
  - The file is read by [Sequelize Command Line Interface](https://github.com/sequelize/cli), which is a tool to create and run database migrations and seeders.
- Validate your database connection. The process exits if there are any errors.
- Run migrations which creates the needed tables in the database.
- Run seeders which fill the database tables with initial data. **If you don't want to run the seeders, you can omit the --seed flag.**
- Create files for the application to write log entries in to.
  - The files that are going to be created, are listed at ./src/config/logs.js.
  - The files will be created to the path specified at .env-file (LOG_STORAGE_PATH).
- Create temporary directories to base tmp directory path specified at .env-file: (TEMPORARY_DIR).
  - This temporary directory would contain files uploaded from the client. For example an import file.

***Other useful npm scripts.***
- `npm run setup-logs` Only creates files for the application logs.
- `npm run validate-env` Only verifies that the required environment variables are set.
- `npm run db:init` Setup the database with migrations and seeders.
- `npm run db:migrate` Useful when new migration file is added so as to update the database with the latest migration.
- `npm run db:seed` Useful when new seeder file is added so as to update the database.
- `npm run seed-for-test` This is already included in the test suite so as to setup the database for testing purpose only.
- `npm run test` Runs all the test suite in `./__tests__`-folder.

***Start the development server with***
```
npm start
```

---

## Localization[![](./src/assets/images/pin.jpg)](#localization)
The project uses [i18next](https://www.npmjs.com/package/i18next) package for localization. Currently the supported languages are English and Finnish. The syntax for the code pointing to the translateable text is in the form of `namespace.describingKeyword`. The namespaces are separated with dots and the syntax is otherwise in camel case. When the program runs, the localization code would be looked up from a localization file. In order for the `i18next` package to find the right translation the code needs to be added to the translation file(s). The previous example of localization code would be described like this in the translation file:
```
{
  "namespace": {
    "describingKeyword": "Expected description for user-view"
  }
}
```
The translation files are at `./src/static/i18n`. The file that is used is determined by the locale set for the `i18next` package.

---

[![](./src/assets/images/backtotop.png)](#bike-api---simple-api-for-helsinki-bike-usage)

[issues-shield]: https://img.shields.io/github/issues/segundara-visma/bike-api.svg?style=flat-square
[issues-url]: https://github.com/segundara-visma/bike-api/issues
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=flat-square&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/olusegunemmanuelokedara/
[github-shield]: https://img.shields.io/static/v1?label=Version%20control&message=Github&color=blue
[github-url]: https://github.com/segundara-visma/bike-api