# SplashScreen

Dynamo Splash Screen

[![License](https://img.shields.io/npm/l/@dynamods/splash-screen)](https://github.com/DynamoDS/SplashScreen/blob/master/LICENSE)

[![version](https://img.shields.io/npm/v/@dynamods/splash-screen?logo=npm&label=version)](https://www.npmjs.com/package/@dynamods/splash-screen)

[![Build](https://github.com/DynamoDS/SplashScreen/actions/workflows/build.yml/badge.svg)](https://github.com/DynamoDS/SplashScreen/actions/workflows/build.yml)

[![Publish](https://github.com/DynamoDS/SplashScreen/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/DynamoDS/SplashScreen/actions/workflows/npm-publish.yml)

Dynamo SplashScreen WebApp which is leveraged in Dynamo. This can also be leveraged by any products that needs a splash screen.

---

## Requirements

For development, you will only need Node.js and a node global package, installed in your environement.

### Node

- #### Node installation on Windows

  Just go on [official Node.js website](https://nodejs.org/) and download the LTS installer. Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      sudo apt install nodejs
      sudo apt install npm

- #### Other Operating Systems

  You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following command (version outputs are just examples).

    $ node --version
    v16.16.0

    $ npm --version
    8.15.0

If you need to update `npm`, you can make it using `npm`!

    npm install npm -g

---

## Install

    git https://github.com/DynamoDS/SplashScreen
    cd SplashScreen
    npm install --force

## Running the project

    npm run start

## Simple build for development

    npm run build

## Simple build for production

    npm run bundle

## Lint

We use [ESlint](https://eslint.org/) to analyze and find problems. It has [integrations](https://eslint.org/docs/latest/user-guide/integrations) for various editors and other tools.

- To find problems

      npm run lint:check

- To fix problems

      npm run lint:fix

## Generate Third Party License Info

- to generate about box html files use `npm run generate_license`, this will output alternative about box files to `license_output/` One will contain the full transitive production dep list, the other will contain the direct production deps.
- These files will be packed into the released npm package

## Bump Version

```shell
npm run version:patch   # To bump patch version
```

## Splash Screen image requirements

Ensure Splash screen image is between 400 - 500px in all dimensions. Refer to https://github.com/DynamoDS/SplashScreen as example. 
