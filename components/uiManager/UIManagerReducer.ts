import { UIReducerActions, Modal, RoomItem } from '../../enum'
import Provider from '../../firebase/Network';
import { onTurnTick } from './Thunks';


const appReducer = (state = getInitialState(), action:any):RState => {
    state.engineEvent = null
    switch (action.type) {
        case UIReducerActions.LOGIN_FAILED:
            return { ...state, modalState: {modal:Modal.MENU, data:action.message}}
        case UIReducerActions.TILE_POPUP: 
            return { ...state, modalState: {modal:Modal.TILE, data: action.tile}}
        case UIReducerActions.SHOW_MODAL:
            return { ...state, modalState: { modal: action.modal } }
        case UIReducerActions.HIDE_MODAL:
            return { ...state, modalState: null }
        case UIReducerActions.LOGIN_SUCCESS:
            return { ...state, onlineAccount: action.user, modalState: { modal: Modal.LOBBY }}
        case UIReducerActions.MATCH_UPDATED:
            return { ...state, match: {...action.match}, engineEvent: { event: UIReducerActions.MATCH_UPDATED, data: action.match } }
        case UIReducerActions.MATCH_JOIN:
            clearInterval(state.turnTimer)
            return { ...state, match:action.match, modalState: { modal: Modal.MATCH_LOBBY }, turnTimer: setInterval(onTurnTick, 1000) }
        case UIReducerActions.MATCH_START:
            let mmatch = {...state.match, isStarted: true }
            Provider.upsertMatch(mmatch)
            return { ...state, match: mmatch, modalState: null}
        case UIReducerActions.MATCH_CREATED:
            let match = action.match
            match.rooms.forEach(r=>{
                if(r.roomItem === RoomItem.CoreMemory){
                    match.players.forEach(p=>{
                        p.roomX = r.roomX
                        p.roomY = r.roomY
                    })
                }
            })
            Provider.upsertMatch(match)
            clearInterval(state.turnTimer)
            return { ...state, match, turnTimer: setInterval(onTurnTick, 1000), modalState:null }
        case UIReducerActions.LEAVE_MATCH:
            Provider.unsubscribeMatch(state.match, state.onlineAccount.uid)
            clearInterval(state.turnTimer)
            return { ...state, match: null, modalState: { modal: Modal.LOBBY }}
        case UIReducerActions.LOGOUT:
            Provider.unsubscribeMatch(state.match, state.onlineAccount.uid)
            clearInterval(state.turnTimer)
            return getInitialState()
        case UIReducerActions.UPDATE_NAME:
            return { ...state, onlineAccount: {...state.onlineAccount, displayName: action.name}}
        case UIReducerActions.JOIN_EXISTING:
            clearInterval(state.turnTimer)
            return { ...state, onlineAccount: action.user, match: action.match, modalState:null, turnTimer: setInterval(onTurnTick, 1000) }
        case UIReducerActions.SEARCH:
            return { ...state, engineEvent: { event: UIReducerActions.SEARCH, data:null }}
        case UIReducerActions.REPAIR:
            return { ...state, engineEvent: { event: UIReducerActions.REPAIR, data:null }}
        case UIReducerActions.START_MOVE:
            return { ...state, engineEvent: { event: UIReducerActions.START_MOVE, data:null }}
        case UIReducerActions.MATCH_TICK:
            state.matchTicks++
            return { ...state, matchTicks: state.matchTicks }
        default:
            return state
    }
};

export default appReducer;

const getInitialState = ():RState => {
    return {
        modalState: { modal: Modal.MENU },
        match: null,
        onlineAccount: null,
        engineEvent: null,
        turnTimer: null,
        matchTicks:0
    }
}