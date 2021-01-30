import firebase from 'firebase/app'
import 'firebase/database'

const config = {
  apiKey: 'AIzaSyBEou3FT3sQZOVDpa-OsCM3d7Taj6e5hho',
  authDomain: 'firechat-vue-46512.firebaseapp.com',
  projectId: 'firechat-vue-46512',
  storageBucket: 'firechat-vue-46512.appspot.com',
  messagingSenderId: '914552365141',
  appId: '1:914552365141:web:28ae6c665e5b0168a2b4dc'
}

const db = firebase.initializeApp(config)
export default db
