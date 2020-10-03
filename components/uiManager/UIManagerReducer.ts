import { UIReducerActions, Modal, RoomItem } from '../../enum'
import Provider, { serviceEmail, servicePwd } from '../../firebase/Network';

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
            return { ...state, match: action.match, engineEvent: { event: UIReducerActions.MATCH_UPDATED, data: action.match } }
        case UIReducerActions.MATCH_JOIN:
            return { ...state, match:action.match, modalState: { modal: Modal.MATCH_LOBBY } }
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
            return { ...state, match, modalState:null }
        case UIReducerActions.LEAVE_MATCH:
            if(state.onlineAccount) Provider.unsubscribeMatch(state.match, state.onlineAccount.uid)
            else return getInitialState()
            return { ...state, match: null, modalState: { modal: Modal.LOBBY }}
        case UIReducerActions.LOGOUT:
            if(state.onlineAccount) Provider.unsubscribeMatch(state.match, state.onlineAccount.uid)
            return getInitialState()
        case UIReducerActions.UPDATE_NAME:
            return { ...state, onlineAccount: {...state.onlineAccount, displayName: action.name}}
        case UIReducerActions.JOIN_EXISTING:
            return { ...state, onlineAccount: action.user, match: action.match, modalState:null }
        case UIReducerActions.SEARCH:
            return { ...state, engineEvent: { event: UIReducerActions.SEARCH, data:null }}
        case UIReducerActions.REPAIR:
            return { ...state, engineEvent: { event: UIReducerActions.REPAIR, data:null }}
        case UIReducerActions.START_MOVE:
            return { ...state, engineEvent: { event: UIReducerActions.START_MOVE, data:null }}
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
        engineEvent: null
    }
}