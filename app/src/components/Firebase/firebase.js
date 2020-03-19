import app from 'firebase/app';
import auth from 'firebase/auth';
import 'firebase/firestore'

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID
}

class Firebase {
  constructor() {
    app.initializeApp(config);

    this.auth = app.auth();
    this.db = app.firestore();
    this.providerGoogle = new app.auth.GoogleAuthProvider();

  }

  doSignInWithGoogle = () => {
    this.auth.signInWithPopup(this.providerGoogle).then(result => {
      let token = result.credential.accessToken;
      let user = result.user;
    })
    .catch(error => console.error(error.code, error.message))
  }
  doSignOut = () => {
    this.auth.signOut();
  }
}

export default Firebase;