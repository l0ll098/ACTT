# Assetto Corsa Time Tracker
A PWA to keep track of your personal best lap times in Assetto Corsa.

## Details
This is a Progressive Web Application, Server Side Rendered using Firebase Functions and based on Angular.

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
