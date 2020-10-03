import * as v4 from 'uuid'
import { Scene } from 'phaser';
import RoomScene from './canvas/RoomScene';
import { PlayerColors, RoomItem, RoomItems, Air } from '../enum';
import * as thyDungeon from 'dungeon-generator' 
import Digger from "./generators/digger";

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
        activePlayerId: player.id,
        turnTimer: 10,
        isVictory: false,
        rooms: generateStationRooms()
    }
    return match
}

export const playersHaveKeys = (coreRoom:RoomState, players:Array<PlayerState>) => {
    const playersInRoom = players.filter(p=>p.roomX === coreRoom.roomX && p.roomY === coreRoom.roomY)
    const playersInventory = playersInRoom.map(p=>p.inventory).reduce((acc, val)=>acc.concat(val), [])
    return playersInventory.includes(RoomItem.BlueSphere) && playersInventory.includes(RoomItem.GreenSphere) && playersInventory.includes(RoomItem.PurpleSphere) && playersInventory.includes(RoomItem.RedSphere)
}

export const generateStationRooms = () => {
    let rooms = new Array<RoomState>()
    let items = RoomItems
    const digger = new Digger(50,25, {corridorLength: [0,0], dugPercentage:0.3, roomWidth:[3,3], roomHeight:[3,3]})
    digger.create()
    digger.getRooms().forEach((room,i) => {
        var x = room._x1;
        var y = room._y1;
        // var w = room.getRight() - room.getLeft()
        // var h = room.getBottom() - room.getTop()
        // var cx = room.getCenter()[0]
        // var cy = room.getCenter()[1]
        // var left = room.getLeft()
        // var right = room.getRight()
        // var top = room.getTop()
        // var bottom = room.getBottom()

        let exits = []
        room.getDoors((dx,dy)=>{
            exits.push({
                x: dx, y:dy
            })
        })

        rooms.push({
            roomX: x,
            roomY: y,
            roomItem: items.length > 0 ? items.shift() : null,
            airState: Air.Normal,
            exits
        })
    });
    return rooms
}

export const getNewPlayer = (name:string, uid:string) => {
    let player:PlayerState = {
        id: uid,
        name,
        color: PlayerColors[Phaser.Math.Between(0,PlayerColors.length-1)],
        roomX:0,
        roomY:0,
        inventory:[],
        actions: 2
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