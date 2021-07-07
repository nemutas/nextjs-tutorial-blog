import admin from 'firebase-admin';

const firebaseConfig = {
	credential: admin.credential.cert({
		projectId: process.env.FIREBASE_SECRET_PROJECT_ID,
		clientEmail: process.env.FIREBASE_SECRET_CLIENT_EMAIL,
		privateKey: process.env.FIREBASE_SECRET_PRIVATE_KEY.replace(/\\n/g, '\n')
	})
};

if (!admin.apps.length) admin.initializeApp(firebaseConfig);

export const storageNode = admin.storage();
