import firebaseConfig from './config/firebase.json';

firebase.initializeApp(firebaseConfig.initializeConfig);
const firestore = firebase.firestore();
firestore.settings({ timestampsInSnapshots: true });

export const db = firestore;