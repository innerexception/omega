import { Scene, GameObjects, Tilemaps, Geom } from "phaser";
import { store } from "../../App";
import { defaults } from '../../assets/Assets'
import { UIReducerActions, FONT_DEFAULT, Modal, RoomItem, Air, TURN_LENGTH } from "../../enum";
import Player from "./Interactable";
import { onMatchUpdated, onEndPlayerAction, onMove } from "../uiManager/Thunks";
import { DIRS } from "../generators/digger";
const ROOM_DIM = 3
const TILE_WIDTH=16

interface RoomShape {
     room:RoomState
     shape:Geom.Rectangle
}

export default class RoomScene extends Scene {

    unsubscribeRedux: Function
    selectIcon: GameObjects.Image
    selectedTile: Tilemaps.Tile
    map: Tilemaps.Tilemap
    playerLayer: Tilemaps.DynamicTilemapLayer
    isDrawingBorder:boolean
    effects: GameObjects.Group
    roomShapes: Array<RoomShape>
    validMoves: Array<RoomShape>
    borderQueue: Array<Tilemaps.Tile>                                                        
    g: GameObjects.Graphics
    initCompleted: boolean
    players: Array<Player>
    graves: Array<Player>
    warningText: GameObjects.Text
    lastNeighbors: Array<Tilemaps.Tile>
    countText: GameObjects.Text
    
    constructor(config){
        super(config)
        this.unsubscribeRedux = store.subscribe(this.onReduxUpdate)
        this.players = []
        this.validMoves = []
    }

    preload = () =>
    {
        defaults.forEach(asset=>{
            (this.load[asset.type] as any)(asset.key, asset.resource, asset.data)
        })
        console.log('assets were loaded.')
    }
    
    onReduxUpdate = () => {
        const uiState = store.getState()
        let engineEvent = uiState.engineEvent
        let mySprite = this.players.find(p=>p.id === store.getState().onlineAccount.uid)
        let plData = uiState.match.players.find(p=>p.id === uiState.onlineAccount.uid)
        if(engineEvent)
            switch(engineEvent.event){
                case UIReducerActions.MATCH_UPDATED:
                    if(this.initCompleted){
                        this.redrawBoard(store.getState().match)
                    }
                    else this.time.addEvent({
                        delay:2000,
                        callback: ()=>{
                            this.redrawBoard(engineEvent.data)
                        }
                    })
                    break
                case UIReducerActions.SEARCH:
                    this.clearMovement()
                    //Grab the item
                    let rroom = uiState.match.rooms.find(r=>r.roomX===plData.roomX && r.roomY === plData.roomY)
                    const mmatch = {...uiState.match, players: uiState.match.players.map(p=>{
                        if(p.id === uiState.onlineAccount.uid){
                            return {...p, inventory: p.inventory.concat([rroom.roomItem])}
                        }
                        return p
                    })}
                    rroom.roomItem = null
                    onEndPlayerAction(mmatch)
                    break
                case UIReducerActions.KILL_VIRUS:
                    this.clearMovement()
                    //Move character to top left corner of room
                    this.tweens.add({
                        targets: mySprite,
                        x: mySprite.x-8,
                        duration: 500,
                        onComplete: ()=>{
                            //End the game
                            this.effects.get(mySprite.x, mySprite.y, 'hacking').setScale(0.5).play('hacking')
                            let match = store.getState().match
                            onMatchUpdated({...match, isVictory: true})
                        }
                    })
                    break
                case UIReducerActions.REPAIR:
                    this.clearMovement()
                    //Play welder animation
                    let proom = uiState.match.rooms.find(r=>r.roomX===plData.roomX && r.roomY === plData.roomY)
                    const match = {...uiState.match, rooms: uiState.match.rooms.map(r=>{
                        if(r.roomX === proom.roomX && r.roomY === proom.roomY){
                            return {...r, airState: r.airState - 1 }
                        }
                        return r
                    })}
                    onEndPlayerAction(match)
                    break
                case UIReducerActions.START_MOVE:
                    //Highlight adjacent rooms
                    let room = uiState.match.rooms.find(r=>r.roomX===plData.roomX && r.roomY === plData.roomY)
                    this.g.clear()
                    if(this.validMoves.length > 0){
                        this.validMoves = []
                        return
                    }
                    room.exits.forEach(e=>{
                        DIRS[4].forEach(dir=>{
                            const ex = e.x*TILE_WIDTH+(dir[0]*TILE_WIDTH)
                            const ey = e.y*TILE_WIDTH+(dir[1]*TILE_WIDTH)
                            let neighbor = this.roomShapes.find(s=>s.shape.contains(ex,ey))
                            if(neighbor && !(neighbor.room.roomX === plData.roomX && neighbor.room.roomY === plData.roomY) && neighbor.room.airState < Air.Vacuum){
                                if(!this.validMoves.includes(neighbor)){
                                    this.validMoves.push(neighbor)
                                    this.g.fillRectShape(neighbor.shape)
                                }
                            }
                        })
                    })
                    break
                case UIReducerActions.MATCH_TICK:
                    if(uiState.matchTicks % TURN_LENGTH === 0){
                        this.warningText = this.add.text(mySprite.x-74, mySprite.y-50, 'Virus damaging station!!', FONT_DEFAULT).setDepth(5)
                        this.warningText.setStroke('#000000', 3);
                        this.tweens.add({
                            targets: this.warningText,
                            alpha: 0,
                            duration:500,
                            repeat: 4,
                            ease: 'Stepped',
                            easeParams: [3],
                            yoyo:true,
                            onComplete: ()=>this.warningText.destroy()
                        })
                    }
                    break
            }
    }

    clearMovement = () => {
        this.g.clear()
        this.validMoves = []
    }

    create = () =>
    {
        this.g = this.add.graphics()
        this.g.defaultFillColor = 0x00ff00
        this.g.defaultFillAlpha = 0.5
        this.g.depth = 2
        this.cameras.main.setZoom(2)
        this.map = this.add.tilemap(undefined, TILE_WIDTH,TILE_WIDTH, 100,100)
        let baseTiles = this.map.addTilesetImage('base-tiles', 'base-tiles', TILE_WIDTH,TILE_WIDTH)
        this.add.tileSprite(this.cameras.main.centerX, this.cameras.main.centerY,2000,2000, 'tiny2')
        this.map.createBlankDynamicLayer('terrain', baseTiles)
        this.map.createBlankDynamicLayer('items', baseTiles)
        this.anims.create({
            key: 'welding',
            frames: this.anims.generateFrameNumbers('welding', { start: 0, end: 10 }),
            frameRate: 8,
            hideOnComplete: true
        });
        this.anims.create({
            key: 'hacking',
            frames: this.anims.generateFrameNumbers('hacking', { start: 0, end: 10 }),
            frameRate: 8,
            hideOnComplete: true
        });
        this.effects = this.add.group()
        
        // setSelectIconPosition(this, this.selectedTile)
        this.input.mouse.disableContextMenu()

        this.input.on('pointerup', (event, gameObjects) => {
            
        })
        this.input.on('pointermove', (event, gameObjects) => {
            
        })
        this.input.on('pointerdown', (event, GameObjects) => {
            const move = this.validMoves.find(m=>m.shape.contains(this.input.activePointer.worldX, this.input.activePointer.worldY))
            if(move){
                const state = store.getState()
                const me = state.match.players.find(p=>p.id === state.onlineAccount.uid)
                this.g.clear()
                this.validMoves = []
                onMove(me, move.room.roomX, move.room.roomY)
            }
        })
        this.initCompleted = true
    }

    redrawBoard = (match:Match) => {
        this.players.forEach(p=>p.destroy())
        this.players = []
        this.graves = []
        this.roomShapes = []
        match.rooms.forEach(r=>{
            this.roomShapes.push({room:r, shape: new Geom.Rectangle(r.roomX*TILE_WIDTH, r.roomY*TILE_WIDTH, 3*TILE_WIDTH,3*TILE_WIDTH)})
            let shakem = new Array<Tilemaps.Tile>()
            let fixem = new Array<Tilemaps.Tile>()
            let weldem
            for(var x=r.roomX; x<r.roomX+ROOM_DIM; x++){
                for(var y=r.roomY;y<r.roomY+ROOM_DIM;y++){
                    let existing = this.map.getTileAt(x,y,false,'terrain')
                    if(existing && existing.index !== 9){
                        if(existing.index < r.airState) shakem.push(existing)
                        if(existing.index > r.airState){
                            fixem.push(existing)
                            weldem = this.map.getTileAt(r.roomX+1,r.roomY+1, false, 'terrain')
                        }
                    } 
                    this.map.putTileAt(r.airState, x,y, false, 'terrain')
                }
            }
            
            if(weldem){
                this.effects.get(weldem.pixelX, weldem.pixelY, 'welding').setScale(0.5).play('welding')
            }

            shakem.forEach(t=>{
                this.tweens.add({
                    targets: t,
                    pixelX: {
                        from: t.pixelX+Phaser.Math.Between(-2,2),
                        to: t.pixelX
                    },
                    pixelY: {
                        from: t.pixelY+Phaser.Math.Between(-2,2),
                        to: t.pixelY
                    },
                    repeat:4,
                    ease: 'Stepped',
                    easeParams: [3],
                    duration: 100
                })
            })
            fixem.forEach(t=>{
                this.tweens.add({
                    targets: t,
                    pixelX: {
                        from: t.pixelX+Phaser.Math.Between(-4,4),
                        to: t.pixelX
                    },
                    pixelY: {
                        from: t.pixelY+Phaser.Math.Between(-4,4),
                        to: t.pixelY
                    },
                    ease: 'Stepped',
                    easeParams: [3],
                    duration: 250
                })
            })
            
            this.map.putTileAt(RoomItem.Logo, r.roomX+1,r.roomY+1,false,'terrain')
            r.exits.forEach(e=>{
                this.map.putTileAt(0, e.x,e.y, false, 'terrain')
                this.map.putTileAt(7, e.x,e.y, false, 'items')
            })

            let p = match.players.filter(p=>p.roomY===r.roomY && p.roomX === r.roomX)
            p.forEach((p,i)=>{
                let g = match.graves.find(g=>g.id === p.id)
                if(!g){
                    let tile = this.map.getTileAt(r.roomX+1, r.roomY+1, false, 'terrain')
                    let pl = new Player(this, tile.getCenterX()+(i*3), tile.getCenterY()-6, p.id, Phaser.Display.Color.HexStringToColor(p.color).color)
                    this.players.push(pl)
                    if(p.id === store.getState().onlineAccount.uid) this.cameras.main.startFollow(pl)
                }
            })

            let g = match.graves.filter(p=>p.roomY===r.roomY && p.roomX === r.roomX)
            g.forEach((g,i)=>{
                let tile = this.map.getTileAt(r.roomX+1, r.roomY+1, false, 'terrain')
                let pl = new Player(this, tile.getCenterX()+(i*3), tile.getCenterY(), g.id, Phaser.Display.Color.HexStringToColor(g.color).color, true)
                this.graves.push(pl)
                if(g.id === store.getState().onlineAccount.uid) this.cameras.main.startFollow(pl)
            })

            if(r.roomItem){
                this.map.putTileAt(r.roomItem, r.roomX, r.roomY, false, 'items')
            }
            else{
                let existing = this.map.getTileAt(r.roomX, r.roomY)
                if(existing && existing.index !== -1){
                    let pl = match.players.find(p=>p.roomX===r.roomX&&p.roomY===r.roomY)
                    let pSprite = this.players.find(p=>p.id === pl.id)
                    this.tweens.add({
                        targets: pSprite,
                        x: pSprite.x-8,
                        y: pSprite.y-8,
                        duration: 500,
                        yoyo: true,
                        ease: 'Stepped',
                        easeParams: [3],
                    })
                }
                this.map.putTileAt(-1, r.roomX, r.roomY, false, 'items')
            } 

            
        })
    }


    tryShowTileInfo = () => {
        let tile = this.map.getTileAtWorldXY(
            this.input.activePointer.worldX, 
            this.input.activePointer.worldY, false, undefined, 'tiles')
        if(tile) {
            //let type = Object.keys(CardTypes).find((type:TileType)=>CardTypes[type].spriteIndex === tile.index)
            //onShowTilePopup(type as TileType)
        }
    }
}