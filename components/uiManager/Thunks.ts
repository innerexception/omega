import { UIReducerActions, Modal } from '../../enum'
import { dispatch, store } from '../../App';
import Provider from '../../firebase/Network';
import { getNextPlayerId } from '../Util';

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

export const onMove = (player:PlayerState, roomX:number, roomY:number) => {
    let match = store.getState().match
    match.players.forEach(p=>{
        if(p.id === player.id){
            player.roomX = roomX
            player.roomY = roomY
        }
    })
    Provider.upsertMatch(match)
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
    dispatch({
        type: UIReducerActions.MATCH_UPDATED,
        match
    })
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

