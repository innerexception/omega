import { UIReducerActions, Modal, Air, TURN_LENGTH } from '../../enum'
import { dispatch, store } from '../../App';
import Provider from '../../firebase/Network';
import { getNextPlayerId } from '../Util';
import { strictEqual } from 'assert';

export const onSearch = () => {
    dispatch({
        type: UIReducerActions.SEARCH
    })
}

export const onRepair = () => {
    dispatch({
        type: UIReducerActions.REPAIR
    })
}

export const onStartMove = () => {
    dispatch({
        type: UIReducerActions.START_MOVE
    })
}

export const onKillVirus = () => {
    dispatch({
        type: UIReducerActions.KILL_VIRUS
    })
}

export const onMove = (player:PlayerState, roomX:number, roomY:number) => {
    let match = store.getState().match
    match.players.forEach(p=>{
        if(p.id === player.id){
            player.roomX = roomX
            player.roomY = roomY
        }
    })
    onEndPlayerAction(match)
}

export const onLeaveMatch = () => {
    dispatch({
        type: UIReducerActions.LEAVE_MATCH
    })
}

export const onHideModal = () => {
    dispatch({
        type: UIReducerActions.HIDE_MODAL
    })
}

export const onLoginUser = (user:firebase.User) => {
    dispatch({
        type: UIReducerActions.LOGIN_SUCCESS,
        user
    })
}

export const onJoinExisting = (user:firebase.User, match:Match) => {
    dispatch({
        type: UIReducerActions.JOIN_EXISTING,
        user, match
    })
}


export const onLogoutUser = () => {
    dispatch({
        type: UIReducerActions.LOGOUT
    })
}

export const onShowModal = (modal:Modal) => {
    dispatch({
        type: UIReducerActions.SHOW_MODAL,
        modal
    })
}

export const onCreateMatch = async (name:string, player:PlayerState) => {
    let match = await Provider.createMatch(name, player)
    dispatch({
        type: UIReducerActions.MATCH_CREATED,
        match
    })
}

export const onTurnTick = () => {
    let match = store.getState().match
    let me = match.players.find(p=>p.id === store.getState().onlineAccount.uid)
    if(store.getState().matchTicks % TURN_LENGTH === 0){
        match.activePlayerId = getNextPlayerId(match.players, match.activePlayerId)
        me.actions = 2
        match = virusAction(match)
        Provider.upsertMatch(match)
        dispatch({
            type: UIReducerActions.MATCH_TICK,
        })
    }
    else if(store.getState().onlineAccount.uid === match.activePlayerId){
        dispatch({
            type: UIReducerActions.MATCH_TICK,
        })
    }
}


export const onJoinMatch = async (matchId:string, player:PlayerState) => {
    await Provider.joinMatch(matchId, player)
}

export const onStartMatch = () => {
    dispatch({
        type: UIReducerActions.MATCH_START
    })
}

export const onMatchUpdated = (match:Match) => {
    dispatch({
        type: UIReducerActions.MATCH_UPDATED,
        match
    })
}

export const onEndPlayerAction = (match:Match) => {
    const me = match.players.find(p=>p.id === store.getState().onlineAccount.uid)
    me.actions--
    if(me.actions <= 0){
        match.activePlayerId = getNextPlayerId(match.players, match.activePlayerId)
        me.actions = 2
    }
    Provider.upsertMatch(match)
}

export const onMatchJoin = (match:Match) => {
    dispatch({
        type: UIReducerActions.MATCH_JOIN,
        match
    })
}

export const onUpdatePlayerName = (name:string) => {
    dispatch({
        type: UIReducerActions.UPDATE_NAME,
        name
    })
}

const virusAction = (match:Match) => {
    //Virus action
    for(let i=0; i<match.players.length+3; i++){
        let eligibleRooms = match.rooms.filter(r=>r.airState<Air.Vacuum)
        let room = eligibleRooms[Phaser.Math.Between(0,eligibleRooms.length-1)]
        if(room){
            room.airState++
            if(room.airState === Air.Vacuum){
                let pl = match.players.find(p=>p.roomX === room.roomX && p.roomY === room.roomY)
                if(pl){
                    match.graves.push({...pl})
                }
            }
        }
    }
    return match
}