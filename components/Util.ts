import * as v4 from 'uuid'
import { Scene } from 'phaser';
import RoomScene from './canvas/RoomScene';
import { PlayerColors, RoomItem, RoomItems, Air } from '../enum';
import * as thyDungeon from 'dungeon-generator' 

enum FirebaseAuthError {
    NOT_FOUND='auth/user-not-found',
    BAD_EMAIL='auth/invalid-email',
    BAD_PASSWORD='auth/wrong-password'
}

export const getErrorMessage = (error:string) => {
    switch(error){
        case FirebaseAuthError.BAD_EMAIL: return 'Invalid email address'
        case FirebaseAuthError.BAD_PASSWORD: return 'Password was incorrect'
        case FirebaseAuthError.NOT_FOUND: return 'No account exists with that email, create one now'
        default: return 'Something happened'
    }
}

export const setSelectIconPosition = (scene:RoomScene, tile:Tuple) => {
    if(scene.selectIcon.x !== tile.x || scene.selectIcon.y !== tile.y) 
        scene.selectIcon.setPosition(tile.x, tile.y)
    scene.selectIcon.setVisible(true)
}

export const getNewMatchObject = (player:PlayerState) => {
    let match:Match = {
        players: [player],
        id:v4(),
        hostPlayerId: player.id,
        turnTimer: 10,
        isStarted: false,
        rooms: generateStationRooms()
    }
    return match
}

export const generateStationRooms = () => {
    let rooms = new Array<RoomState>()
    let items = RoomItems
    const generator = new thyDungeon({
        "size": [100, 100],
        "rooms": {
            "initial": {
                "min_size": [3, 3],
                "max_size": [3, 3],
                "max_exits": 1
            },
            "any": {
                "min_size": [3, 3],
                "max_size": [3,3],
                "max_exits": 4
            }
        },
        "max_corridor_length": 2,
        "min_corridor_length": 2,
        "corridor_density": 0.5,
        "symmetric_rooms": true,
        "interconnects": 0,
        "max_interconnect_length": 0,
        "room_count": 20
    })
    generator.generate()
    generator.children.forEach(room=>{
        rooms.push({
            roomX: room.position[0],
            roomY: room.position[1],
            roomItem: items.length > 0 ? items.shift() : null,
            airState: Air.Normal,
            exits: room.exits.map(e=>{
                return {
                    x: e[0][0], y:e[0][1]
                }
            })
        })
    })
    return rooms
}

export const getNewPlayer = (name:string, uid:string) => {
    let player:PlayerState = {
        id: uid,
        name,
        color: PlayerColors[Phaser.Math.Between(0,PlayerColors.length-1)],
        roomX:0,
        roomY:0,
        inventory:[]
    }
    return player
}

export const getNextPlayerId = (players:Array<PlayerState>, activeId:string) => {
    let i = players.findIndex(p=>p.id === activeId)
    return players[(i+1)%players.length].id
}

export const getCircle = (cx: number, cy: number, r: number, topology?:number) => {
    let result = [];
    let dirs, countFactor, startOffset;
    if(!topology) topology = 4
    switch (topology) {
        case 4:
            countFactor = 1;
            startOffset = [0, 1];
            dirs = [
                DIRS[8][7],
                DIRS[8][1],
                DIRS[8][3],
                DIRS[8][5]
            ];
        break;

        case 6:
            dirs = DIRS[6];
            countFactor = 1;
            startOffset = [-1, 1];
        break;

        case 8:
            dirs = DIRS[4];
            countFactor = 2;
            startOffset = [-1, 1];
        break;

        default:
            throw new Error("Incorrect topology for FOV computation");
        break;
    }

    /* starting neighbor */
    let x = cx + startOffset[0]*r;
    let y = cy + startOffset[1]*r;

    /* circle */
    for (let i=0;i<dirs.length;i++) {
        for (let j=0;j<r*countFactor;j++) {
            result.push([x, y]);
            x += dirs[i][0];
            y += dirs[i][1];

        }
    }

    return result;
}

const DIRS = {
	4: [[0, -1], [1, 0], [0, 1], [-1, 0]],
	8: [[0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]],
	6: [[-1, -1], [1, -1], [2, 0], [1, 1], [-1, 1], [-2, 0]]
};