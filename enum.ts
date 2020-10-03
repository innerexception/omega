export enum UIReducerActions { 
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
    HELP='halp',
    CONFIRM='editr',
    MENU='menoo',
    SCORES='scrs',
    LOBBY='lbby',
    MATCH_LOBBY='mtchlob',
    TILE='tilepop'
}

export enum TileType {
    Mountain='Mountain',
    Lake='Lake',
    Forest='Forest',
    Hill='Hill',
    Town='Town',
    City='City',
    Tower='Tower',
    Field='Field',
    Monument='Monument'
}

export enum Air {
    Normal, Venting, Vacuum
}

export enum RoomItem {
    Suit, RedSphere, BlueSphere, GreenSphere, PurpleSphere, CoreMemory
}

export const RoomItems = [RoomItem.Suit, RoomItem.RedSphere, RoomItem.BlueSphere, RoomItem.GreenSphere, RoomItem.PurpleSphere, RoomItem.CoreMemory]

export const CardTypes = {
    [TileType.City]: {
        spriteIndex: 15,
        name: 'City',
        bonuses: [TileType.Lake, TileType.Hill],
        penalties: [TileType.City]
    },
    [TileType.Field]: {
        spriteIndex: 48,
        name: 'Field',
        bonuses: [TileType.Town, TileType.Lake],
        penalties: [TileType.City]
    },
    [TileType.Forest]: {
        spriteIndex: 5,
        name: 'Forest',
        bonuses: [TileType.Forest],
        penalties: [TileType.Town, TileType.City]
    },
    [TileType.Hill]: {
        spriteIndex: 27,
        name: 'Hill',
        bonuses: [TileType.Mountain],
        penalties: [TileType.Lake]
    },
    [TileType.Lake]: {
        spriteIndex: 18,
        name: 'Lake',
        bonuses: [],
        penalties: []
    },
    [TileType.Monument]: {
        spriteIndex: 36,
        name: 'Monument',
        bonuses: [],
        penalties: []
    },
    [TileType.Mountain]: {
        spriteIndex: 10,
        name: 'Mountain',
        bonuses: [TileType.Mountain],
        penalties: []
    },
    [TileType.Tower]: {
        spriteIndex: 23,
        name: 'Tower',
        bonuses: [TileType.City, TileType.Hill],
        penalties: [TileType.Forest]
    },
    [TileType.Town]: {
        spriteIndex: 8,
        name: 'Town',
        bonuses: [TileType.Field],
        penalties: [TileType.City, TileType.Town]
    }
}