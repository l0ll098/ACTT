import { LapTime, Log } from '../../../shared/data.model';
import { DialogData } from '../models/dialog.model';

export abstract class MockData {
    public static user = {
        displayName: "Just tesing",
        email: "just.testing@example.com",
        photoURL: `${location.protocol}//${location.host}/assets/images/favicon-32x32.png`,
        emailVerified: false
    };

    public static lapTime: LapTime = {
        car: {
            name: "Ferrari SF70H"
        },
        lap: 1,
        time: {
            minutes: 1,
            seconds: 25,
            millisecs: 123
        },
        track: {
            name: "Monza",
            length: 5793
        },
        timestamp: Date.now(),
        id: "-Just-A-Test"
    };

    public static lapTimes: LapTime[] = [
        MockData.lapTime,
        {
            car: {
                name: "Ferrari SF70H"
            },
            lap: 1,
            time: {
                minutes: 0,
                seconds: 10,
                millisecs: 10
            },
            track: {
                name: "Drag",
                length: 200
            },
            timestamp: Date.now(),
            id: "-Just-A-Test-2"
        }
    ];

    public static logs: Log[] = [
        {
            id: 0,
            log: "Log 1",
            timestamp: Date.now()
        },
        {
            id: 1,
            log: "Log 2",
            timestamp: Date.now()
        }
    ];

    public static dialog: DialogData = {
        title: "Testing",
        message: "Just testing",
        doActionBtn: {
            text: "Ok",
            onClick: () => {
                console.log("Ok");
            }
        },
        cancelBtn: {
            text: "Cancel",
            onClick: () => {
                console.log("Cancel");
            }
        }
    };
}
