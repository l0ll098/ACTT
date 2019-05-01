# Assetto Corsa Time Tracker
A PWA to keep track of your personal best lap times in Assetto Corsa

## Project Structure
### Components
| Component name | Details                                                                                                         | See also |
|----------------|-----------------------------------------------------------------------------------------------------------------|----------|
| dialog         | An helper component used to show dialogs in Material Design.                                                    |          |
| home           | This is the main component. It shows the app shell and it has a <code>router-outlet</code> to show other paths. |          |
| lap-assits     | An helper component used to show all the available assists used in the lap. User can pick one or more of them.  |          |
| lap-time       | Another helper component. It's used to create a custom input form, asking for a laptime                         |          |
| login          | It shows a login form.                                                                                          |          |
| logs           | This is mainly a debug component. USed to show app logs.                                                        |          |
| new-time       | A component to enter a new laptime. It uses <code>lap-time</code> and <code>lap-assists</code> components.      |          |
| not-found      | This will show user a custom error screen if the requested page is not found.                                   |          |
| settings       | This one is a component used to show settings. It can handle a variety of them.                                 |          |
| times          | It shows user a table where he can check his previously saved times.                                            |          |
| lap-time-deatils| It's used to show details of a certain lap time |          |

### Models
| Model name      | Details                                                                                | See also |
|-----------------|----------------------------------------------------------------------------------------|----------|
| cars.ts         | It contains an array with all the currently available cars in the game                 |          |
| tracks.ts       | The same thing as <code>cars.ts</code>, only for tracks.                               |          |
| data.model.ts   | It contains some data structures used to query the database and represent the results. |          |
| dialog.model.ts | Some interfaces to handle dialogs.                                                     |          |


### Services
| Service file name    | Details                                                                                                    | See also |
|----------------------|------------------------------------------------------------------------------------------------------------|----------|
| auth.service.ts      | It handles authentication.                                                                                 |          |
| firebase.service.ts  | This service handles queries against Firebase database.                                                    |          |
| indexedDb.service.ts | This one is used to interact with Indexed DB. If it's not supported, it won't do anything.                 |          |
| log.service.ts       | It's used to log both to console and Indexed DB. Doing so, users can see logs produced by the application. |          |
| settings.service.ts  | This one controls app settings. It also provides functions to save and get setting values.                 |          |



## Build
- Dev
    ```
        npm run build
    ```

- Production (AOT builds and Service Worker generation)
    ```
        npm run buildProd
    ```

## Deploy
```
    firebase deploy
```
