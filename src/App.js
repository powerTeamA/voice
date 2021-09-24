import React, { useState } from 'react'
import Dashboard from './components/Dashboard'
import Login from './components/Login'
import firebase from 'firebase'
import firebaseConfig from './firebaseConfig.json'

export default function App() {
    firebase.apps.length
        ? firebase.app()
        : firebase.initializeApp(firebaseConfig)

    const [user, setUser] = useState(null)
    firebase.auth().onAuthStateChanged((user) => setUser(user ?? null))

    return user ? <Dashboard /> : <Login />
}
