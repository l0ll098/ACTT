import * as firebase from "firebase";
import * as firebaseui from "firebaseui";

export const environment = {
	production: true,
	enableAngularRoutingLog: false,

	firebase: {
		apiKey: "<your-key>",
		authDomain: "<your-project-authdomain>",
		databaseURL: "<your-database-URL>",
		projectId: "<your-project-id>",
		storageBucket: "<your-storage-bucket>",
		messagingSenderId: "<your-messaging-sender-id>"
	}
};

export const firebaseUIConfigs: firebaseui.auth.Config = {
	signInFlow: "redirect",
	signInOptions: [
		firebase.auth.GoogleAuthProvider.PROVIDER_ID,
		firebase.auth.EmailAuthProvider.PROVIDER_ID
	],
	tosUrl: '<your-tos-link>',
	privacyPolicyUrl: '<your-privacyPolicyUrl-link>',
	credentialHelper: firebaseui.auth.CredentialHelper.GOOGLE_YOLO
};
