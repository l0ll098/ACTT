import { FirebaseService } from "../services/firebase.service";
import { LapTime } from '../../../shared/data.model';
import { MockData } from './data';

export class MockFirebaseService extends FirebaseService {

    getLapTimeById(id: string): Promise<LapTime> {
        return Promise.resolve(MockData.lapTime);
    }

    saveUserLapTime(lapTime: LapTime): Promise<LapTime> {
        return Promise.resolve(lapTime);
    }

    getLapTimes(): Promise<LapTime[]> {
        return Promise.resolve(MockData.lapTimes);
    }
}
