import Firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import store from '../store'

const config = {
  apiKey: 'AIzaSyCrv0G4aexf88M8ikUNPgO-0R6m8EtpBCI',
  authDomain: 'week50k-24c45.firebaseapp.com',
  databaseURL: 'https://week50k-24c45.firebaseio.com',
  projectId: 'week50k-24c45',
  storageBucket: 'week50k-24c45.appspot.com',
  messagingSenderId: '56160359471'
}

export default {
  install: (Vue) => {
    Firebase.initializeApp(config)
    Firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        store.commit('auth/updateUser', { user })
      }
    })

    Vue.prototype.$firebase = Firebase
    Vue.firebase = Firebase
  }
}
