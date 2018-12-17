import { firebaseui, firebase } from "firebaseui-angular";

// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
	production: false,
	enableAngularRoutingLog: false,
	enableIDBLog: false,

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
