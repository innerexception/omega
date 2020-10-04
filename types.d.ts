
interface Tuple {
    x:number
    y:number
}

interface PlayerState {
    id: string
    name: string
    color: string
    roomX: number
    roomY: number
    inventory: Array<import('./enum').RoomItem>
    actions: number
}

interface GraveState {
    id:string
    name: string
    color: string
    roomX: number
    roomY: number
}

interface EngineEvent {
    event: import('./enum').UIReducerActions
    data: any
}

interface ModalState {
    modal: import('./enum').Modal
    data?: any
}

interface Match { 
    id:string
    activePlayerId:string
    players: Array<PlayerState>
    graves: Array<GraveState>
    rooms: Array<RoomState>
    isVictory:boolean
    spheres: Array<import('./enum').RoomItem>
}

interface RoomState {
    roomX:number
    roomY:number
    roomItem?: import('./enum').RoomItem
    airState: import('./enum').Air
    exits: Array<ExitState>
}

interface ExitState {
    coords: Tuple
    isOpen:boolean
}

interface RState {
    modalState: ModalState
    engineEvent: EngineEvent
    match: Match
    onlineAccount:firebase.User
    turnTimer: any
    matchTicks:number
}