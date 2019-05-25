# Assetto Corsa Time Tracker
A PWA to keep track of your personal best lap times in Assetto Corsa.

## Details
This is a Progressive Web Application, Server Side Rendered using Firebase Functions and based on Angular.

## App Structure
In the `src/app` folder there are different Angular modules.
The first one, called `app.shared.module.ts`, is shared between server and app.
The module called `app.module.ts` is used only on the client and is responsible to import Firebase.
The other one, called `app.server.module.ts`, is used to Server Side Rendering the application.

Note: Those modules are separated in this way so that Firebase Functions can work without conflicting because it finds the Firebase library multiple times.

## Commands
 - Serve app locally
 ```console
    $ npm start
 ```

 - Build app
 ```console
    $ npm run build
 ```

 - Build app(production, AOT & Service Worker)
 ```console
    $ npm run build:prod
 ```

 - Build Functions
 ```console
    $ cd ./functions/
    $ npm run build
 ```

 If you want to build App and Functions in a single command, run:
 ```console
    $ npm run gulp
 ```

## Deploy
To deploy an already built app and functions, run:
```console
    $ firebase deploy
```
