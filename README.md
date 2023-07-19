# Bike API - Simple API for Helsinki Bike usage.

[![github-shield]][github-url]
[![Issues][issues-shield]][issues-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

---

## Introduction[![](./src/assets/images/pin.jpg)](#introduction)

This personal project is just a simple backend service for Helsinki Bike usage. It made use of apollo server express with graphql to build a GraphQL API, mysql as the database and sequelize as the ORM to communicate with the database.

---

## Prerequisites[![](./src/assets/images/pin.jpg)](#prerequisites)
You need to have following programs installed:
| Program | URL | Description |
| --- | --- | --- |
| Node.js | https://nodejs.org/en/ | JavaScript runtime. The whole project is based on Node.js. |
| NPM | https://www.npmjs.com | Node package manager for installing different dependencies |
| MySql | https://www.mysql.com/ | A database engine for the project |

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

***Start the development server with***
```
npm start
```

---

## Localization[![](./src/assets/images/pin.jpg)](#localization)
The project uses [i18next](https://www.npmjs.com/package/i18next) package for localization. Currently the supported languages are English and Finnish. The translateable text is always enclosed in a function which is `__`. E.g. `__('localizationCode')`. The parameter is a made-up code that describes the translation. The syntax for the code is `namespace.describingKeyword`. The namespaces are separated with dots and the syntax is otherwise in camel case. When the program runs, the localization code would be looked up from a localization file. In order for the `i18next` package to find the right translation the code needs to be added to the translation file(s). The previous example of localization code would be described like this in the translation file:
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