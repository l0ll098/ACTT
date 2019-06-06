import { FirebaseService } from "../services/firebase.service";
import { LapTime } from '../models/data.model';
import { MockData } from './data';

export class MockFirebaseService extends FirebaseService {

    getLapTimeById(id: string): Promise<LapTime> {
        return Promise.resolve(MockData.lapTime);
    }

}
