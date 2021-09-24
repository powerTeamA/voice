import React from 'react'
import firebase from 'firebase'
import { Button } from '@material-ui/core'
import { Lock } from '@material-ui/icons'

export default function Logout() {
    const signOut = () => {
        firebase.auth().signOut().catch(console.error)
    }
    return (
        <>
            <Button variant="outlined" startIcon={<Lock />} onClick={signOut}>
                로그아웃
            </Button>
        </>
    )
}
