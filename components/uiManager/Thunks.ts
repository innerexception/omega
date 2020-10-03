import { UIReducerActions, Modal } from '../../enum'
import { dispatch, store } from '../../App';
import Provider from '../../firebase/Network';

export const onPlacedTile = () => {
    dispatch({
        type: UIReducerActions.PLACED_TILE
    })
}


export const onStartPlaceBorders = () => {
    dispatch({
        type: UIReducerActions.START_BORDERS
    })
}

export const onCancelBorders = () => {
    dispatch({
        type: UIReducerActions.CANCEL_BORDERS
    })
}

export const onLeaveMatch = () => {
    dispatch({
        type: UIReducerActions.LEAVE_MATCH
    })
}

export const onConfirmBorder = (border:Array<Tuple>) => {
    dispatch({
        type: UIReducerActions.CONFIRM_BORDER,
        border
    })
}

export const onHideModal = () => {
    dispatch({
        type: UIReducerActions.HIDE_MODAL
    })
}

export const onSaveBorder = (border:Array<Tuple>) => {
    dispatch({
        type: UIReducerActions.SAVE_BORDER,
        border
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

export const onStartOffline = () => {
    dispatch({
        type: UIReducerActions.START_OFFLINE
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

