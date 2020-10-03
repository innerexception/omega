declare enum UIReducerActions { 
    LOGOUT='logout',
    LOGIN_FAILED='logf',
    TILE_TYPE_SELECTED='ttsel',
    PLACED_TILE='plactt',
    START_BORDERS='trrsd',
    CANCEL_BORDERS='cnelbrder',
    CONFIRM_BORDER='cfrmbrder',
    HIDE_MODAL='hdmdl',
    SAVE_BORDER='svbrdr',
    CLEAR_BORDER='clrbrd',
    SCORING='scring',
    SCORE_REPORT='scrrpt',
    MATCH_UPDATED='mchup',
    MATCH_CREATED='mtchre',
    SHOW_MODAL='showmdl',
    START_OFFLINE='strtoff',
    LOGIN_SUCCESS='gotolo',
    MATCH_JOIN='mtchjoi',
    MATCH_START='mtchstrt',
    UPDATE_NAME='updaten',
    LEAVE_MATCH='lvmatch',
    JOIN_EXISTING='jnexist',
    DAILY_LOADED='dailyld',
    TILE_POPUP='tilepop'
}

interface Tuple {
    x:number
    y:number
}

declare enum Modal {
    HELP='halp',
    CONFIRM='editr',
    MENU='menoo',
    SCORES='scrs',
    LOBBY='lbby',
    MATCH_LOBBY='mtchlob',
    TILE='tilepop'
}

interface PlayerState {
    id: string
    name: string
    color: string
    roomX: number
    roomY: number
    inventory: Array<import('./enum').RoomItem>
}

interface EngineEvent {
    event: UIReducerActions
    data: any
}

interface ModalState {
    modal: Modal
    data?: any
}

interface Match { 
    id:string
    hostPlayerId:string
    turnTimer: number
    players: Array<PlayerState>
    rooms: Array<RoomState>
    isStarted:boolean
}

interface RoomState {
    roomX:number
    roomY:number
    roomItem?: import('./enum').RoomItem
    airState: import('./enum').Air
    exits: Array<Tuple>
}

interface RState {
    modalState: ModalState
    engineEvent: EngineEvent
    match: Match
    onlineAccount:firebase.User
}