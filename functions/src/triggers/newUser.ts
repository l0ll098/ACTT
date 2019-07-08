import { auth } from 'firebase-functions';
import * as admin from "firebase-admin";

import { FirebaseService } from '../../shared/helpers';
import { Notification, EClientActions } from '../../../shared/data.model';

try {
    admin.initializeApp();
} catch (err) { }

// Export a function triggered when a new user is created
export const newUser = auth.user()
    .onCreate(async (user) => {

        // Check if the new user has a verified email     
        if (!user.emailVerified) {
            // If not, create a new notification to tell him to verify his account
            const notification: Notification = {
                title: "Verify your account",
                description: "Please verify your account",
                category: "warning",
                actions: [
                    {
                        method: "POST",
                        path: "notifications/$id",
                        description: "Mark as read"
                    },
                    {
                        name: EClientActions.verify
                    }
                ]
            };

            await FirebaseService.createNotification(notification, user.uid);
        }
    });
