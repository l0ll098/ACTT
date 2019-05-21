import { firebase } from "firebaseui-angular";

export const environment = {
	production: true,
	enableAngularRoutingLog: false,
	enableIDBLog: true,

	firebase: {
		apiKey: "<your-key>",
		authDomain: "<your-project-authdomain>",
		databaseURL: "<your-database-URL>",
		projectId: "<your-project-id>",
		storageBucket: "<your-storage-bucket>",
		messagingSenderId: "<your-messaging-sender-id>",
		functionsUrl: "https://<region>-<appname>.cloudfunctions.net/api"
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
	credentialHelper: "googleyolo"
};
