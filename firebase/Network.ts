// This import loads the firebase namespace along with all its type information.
import * as firebase from 'firebase/app';
import { firebaseConfig } from './firebase.config.js'
// These imports load individual services into the firebase namespace.
import 'firebase/auth';
import 'firebase/firestore';
import { RoomItem, Air } from '../enum';
import { Schemas } from './Schemas'
import { onLoginUser, onMatchUpdated, onLogoutUser, onMatchJoin, onUpdatePlayerName, onJoinExisting } from '../components/uiManager/Thunks';
import { getNewMatchObject, getNextPlayerId } from '../components/Util';
import * as v4 from 'uuid'
export const servicePwd = '4yhw64h67eh6s5gs5rgghn#^H#%^H'
export const serviceEmail = 'scoring@crytomnesicsoftworks.com'

firebase.initializeApp(firebaseConfig);

class Network {
    db: firebase.firestore.Firestore
    auth: firebase.auth.Auth
    unsub: Function

    constructor(){
        this.db = firebase.firestore()
        this.auth = firebase.auth()
        this.auth.onIdTokenChanged(async (user) => {
            if (user) {
                let ref = await this.db.collection(Schemas.Collections.Matches.collectionName).get()
                let matches = ref.docs.map(d=>d.data() as Match)
                let existingMatch = matches.find(m=>m.players.findIndex(p=>p.id === user.uid)!==-1)
                if(existingMatch){
                    onJoinExisting(user, existingMatch)
                    this.subscribeToMatch(existingMatch.id)
                    return
                }
                onLoginUser(user)
            } else {
                await Provider.onCreateUser(v4()+'@email.com', v4())
            }
        });
    }
    logoutUser = () => {
        this.auth.signOut()
    }
    onTrySignIn = async (email:string, password:string) => {
        await this.auth.signInWithEmailAndPassword(email, password)
    }
    onCreateUser = async (email:string, password:string) => {
        await this.auth.createUserWithEmailAndPassword(email, password)
    }
    onEditHandle = async (handle:string) => {
        this.auth.currentUser.updateProfile({displayName: handle})
        onUpdatePlayerName(handle)
    }
    sendVerification = () => {
        this.auth.currentUser.sendEmailVerification()
    }
    createMatch = async (name:string, player:PlayerState) => {
        let match = getNewMatchObject(player)
        await this.upsertMatch(match)
        onMatchJoin(match)
        this.subscribeToMatch(match.id)
        return match
    }

    joinMatch = async (matchId:string, player:PlayerState) => {
        let ref = await this.db.collection(Schemas.Collections.Matches.collectionName).doc(matchId).get()
        if(ref.exists){
            let match = ref.data() as Match
            match.players.push(player)
            match.rooms.forEach(r=>{
                if(r.roomItem === RoomItem.CoreMemory){
                    match.players.forEach(p=>{
                        if(p.id === player.id){
                            p.roomX = r.roomX
                            p.roomY = r.roomY
                        }
                    })
                }
            })
            onMatchJoin(match)
            await this.upsertMatch(match)
            this.subscribeToMatch(match.id)
        }
    }

    fetchAndSubscribeMatches = async (cb:Function) => {
        let ref = await this.db.collection(Schemas.Collections.Matches.collectionName).get()
        ref.docs.forEach(d=>{
            let match = d.data() as Match
            if(match.players.length === 0) this.deleteMatch(match.id)
        })

        return this.db.collection(Schemas.Collections.Matches.collectionName)
            .onSnapshot((snap)=>{
                let matches = snap.docs.map(d=>d.data() as Match)
                cb(matches)
            })
    }

    deleteMatch = async (matchId:string) => {
        await this.db.collection(Schemas.Collections.Matches.collectionName).doc(matchId).delete()
    }

    subscribeToMatch = (id:string) => {
        if(this.unsub) console.warn('uhh, already subscribed to a match??')
        this.unsub = this.db.collection(Schemas.Collections.Matches.collectionName).doc(id)
        .onSnapshot(
            (snap) => {
                let match = snap.data() as Match
                onMatchUpdated(match)
            }
        )
    }

    unsubscribeMatch = (match:Match, playerId:string) => {
        if(this.unsub){
            this.unsub()
            this.unsub = null
            if(match.activePlayerId === playerId) {
                match.activePlayerId = getNextPlayerId(match.players, match.activePlayerId)
            }
            let pl = match.players.find(p=>p.id === playerId)
            pl.inventory && pl.inventory.forEach(i=>{
                let available = match.rooms.filter(r=>r.airState > Air.Vacuum)
                let candidate = available[Phaser.Math.Between(0, available.length-1)]
                if(candidate) candidate.roomItem = i
            })
            match.players = match.players.filter(p=>p.id !== playerId)
            if(match.players.length <= 0) this.deleteMatch(match.id)
            else this.upsertMatch(match)
        }
    }

    upsertMatch = async (match:Match) => {
        await this.db.collection(Schemas.Collections.Matches.collectionName).doc(match.id).set(match)
    }

    doSignInWithEmailAndPassword = (email:string, password:string) => this.auth.signInWithEmailAndPassword(email, password)

    doSignOut = () => this.auth.signOut()
  
    //sendPasswordReset = (email:string) => this.auth.sendPasswordResetEmail(email, { url: baseApiUrl+ROUTES.RESET_PASSWORD})
  
    confirmPasswordReset = (token:string, newPassword:string) => this.auth.confirmPasswordReset(token, newPassword)

    verifyPasswordToken = (token:string) => this.auth.verifyPasswordResetCode(token)

    doSendEmailVerification = () => {
        this.auth.currentUser && this.auth.currentUser.sendEmailVerification()
    }

    verifyEmail = async (token:string) => this.auth.applyActionCode(token)

    doPasswordUpdate = password => this.auth.currentUser && this.auth.currentUser.updatePassword(password)
}

let Provider = new Network()

export default Provider