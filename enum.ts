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
    MATCH_TICK
}

export const TURN_LENGTH = 30

export const FONT_DEFAULT = {
    fontFamily: 'Body', 
    fontSize: '14px',
    color:'black',
}

export const PlayerColors = [
    '#3D2F23',
    '#974627',
    '#B38B48',
    '#DEBF78',
    '#616D66',
    '#F7B728',
    '#63BB50',
    '#6893C5',
    '#F0E9B9',
    '#DD9058'
]

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
    PurpleSphere=3, RedSphere=4, GreenSphere=5, BlueSphere=6, CoreMemory=8, Exit=7, Logo=9
}

export const RoomItems = [RoomItem.RedSphere, RoomItem.BlueSphere, RoomItem.GreenSphere, RoomItem.PurpleSphere, RoomItem.CoreMemory]