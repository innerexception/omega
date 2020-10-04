export enum UIReducerActions { 
    LOGOUT,
    LOGIN_FAILED,
    HIDE_MODAL,
    MATCH_UPDATED,
    MATCH_CREATED,
    SHOW_MODAL,
    LOGIN_SUCCESS,
    MATCH_JOIN,
    MATCH_START,
    UPDATE_NAME,
    LEAVE_MATCH,
    JOIN_EXISTING,
    TILE_POPUP,
    SEARCH,
    START_MOVE,
    REPAIR,
    KILL_VIRUS,
    MATCH_TICK,
    DEPOSIT
}

export const TURN_LENGTH = (color:string) => color === PlayerColors[3] ? 30 : 15

export const FONT_DEFAULT = {
    fontFamily: 'Body', 
    fontSize: '18px',
    color:'orange',
}

export const PlayerColors = [
    '#55ffff', //blue
    '#55ff55', //green
    '#ff5555', //red
    '#ffff55' //yellow
]

export const PlayerColorData = {
    [PlayerColors[0]]: {
        title: 'Engineer',
        description: 'You are an engineer, and have free repair actions',
    },
    [PlayerColors[1]]: {
        title: 'Scout',
        description: 'You are a scout, and move for half cost'
    },
    [PlayerColors[2]]: {
        title: 'Droid',
        description: 'You are a memory droid, and can carry 4 memory spheres at once, and move through vacuum spaces.'
    },
    [PlayerColors[3]]: {
        title: 'Decker',
        description: 'You are a decker, and cause the virus to attack slower during your turn and have free download actions'
    }
}

export enum Modal {
    HELP,
    CONFIRM,
    MENU,
    SCORES,
    LOBBY,
    MATCH_LOBBY,
    TILE
}

export enum Air {
    Normal, Venting, Vacuum
}

export enum RoomItem {
    PurpleSphere=3, RedSphere=4, GreenSphere=5, BlueSphere=6, CoreMemory=8, Exit=7, Logo=9, Grave=111
}

export const RoomItems = [RoomItem.RedSphere, RoomItem.BlueSphere, RoomItem.GreenSphere, RoomItem.PurpleSphere, RoomItem.CoreMemory]

export const ItemDescriptions = {
    [RoomItem.BlueSphere]: 'The blue decryption sphere. Collect all 4 to erase the virus.',
    [RoomItem.CoreMemory]: 'The core memory access. Bring the 4 decryption spheres here.',
    [RoomItem.GreenSphere]: 'The green decryption sphere. Collect all 4 to erase the virus.',
    [RoomItem.PurpleSphere]: 'The purple decryption sphere. Collect all 4 to erase the virus.',
    [RoomItem.RedSphere]: 'The red decryption sphere. Collect all 4 to erase the virus.',
    [RoomItem.Grave]: 'Here lies $'
}