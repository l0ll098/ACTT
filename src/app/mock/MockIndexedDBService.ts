import { IndexedDBService } from "../services/indexedDb.service";
import { MockData } from './data';

export class MockIndexedDBService extends IndexedDBService {

    getLogs() {
        return Promise.resolve(MockData.logs);
    }
}
