import { Observable, of } from 'rxjs';
import { User } from 'firebase';

import { AuthService } from "../services/auth.service";
import { MockData } from './data';


export class MockAuthService extends AuthService {

    private static _user: User = MockData.user as User;


    public static setUser(newUser: User | null) {
        MockAuthService._user = newUser;
        MockAuthService._user.getIdToken = (forceRefresh?: boolean): Promise<string> => {
            return Promise.resolve("-token-");
        };
    }

    canActivate(): Observable<boolean> {
        return MockAuthService._user ? of(true) : of(false);
    }

    getUserData(): Observable<User> {
        return of(MockAuthService._user);
    }

    getToken(): Promise<string> {
        return Promise.resolve("-token-");
    }
}
