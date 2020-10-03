import { Scene, GameObjects, Tilemaps } from "phaser";
import { store } from "../../App";
import { defaults } from '../../assets/Assets'
import { setSelectIconPosition, getCircle, } from "../Util";
import { CardTypes, UIReducerActions, TileType, FONT_DEFAULT, Modal } from "../../enum";
import Provider from "../../firebase/Network";
import Player from "./Interactable";
const ROOM_DIM = 3
export default class RoomScene extends Scene {

    unsubscribeRedux: Function
    selectIcon: GameObjects.Image
    selectedTile: Tilemaps.Tile
    map: Tilemaps.Tilemap
    playerLayer: Tilemaps.DynamicTilemapLayer
    placingTileType: TileType
    isDrawingBorder:boolean
    borderQueue: Array<Tilemaps.Tile>                                                        
    g: GameObjects.Graphics
    initCompleted: boolean
    players: Array<Player>
    texts: Array<GameObjects.Text>
    lastNeighbors: Array<Tilemaps.Tile>
    countText: GameObjects.Text
    
    constructor(config){
        super(config)
        this.unsubscribeRedux = store.subscribe(this.onReduxUpdate)
        this.players = []
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
            }
    }

    create = () =>
    {
        this.add.tileSprite(0,0,2000,2000, 'tiny2').setOrigin(0,0)
        //this.cameras.main.setZoom(2)
        this.map = this.add.tilemap(undefined, 16,16, 100,100)
        let baseTiles = this.map.addTilesetImage('base-tiles', 'base-tiles', 16,16)
        this.map.createBlankDynamicLayer('terrain', baseTiles)
        this.map.createBlankDynamicLayer('items', baseTiles)
        
        
        // setSelectIconPosition(this, this.selectedTile)
        this.input.mouse.disableContextMenu()

        this.input.on('pointerup', (event, gameObjects) => {
            
        })
        this.input.on('pointermove', (event, gameObjects) => {
            
        })
        this.input.on('pointerdown', (event, GameObjects) => {
            this.tryShowTileInfo()
        })
        this.initCompleted = true
    }

    redrawBoard = (match:Match) => {
        this.players.forEach(p=>p.destroy())
        this.players = []
        match.rooms.forEach(r=>{
            for(var x=r.roomX; x<r.roomX+ROOM_DIM; x++){
                for(var y=r.roomY;y<r.roomY+ROOM_DIM;y++){
                    this.map.putTileAt(Phaser.Math.Between(0,2), x,y, false, 'terrain')
                }
            }
            r.exits.forEach(e=>{
                this.map.putTileAt(7, r.roomX-1+e.x,r.roomY-1+e.y, false, 'terrain')
            })
            let p = match.players.find(p=>p.roomY===r.roomY && p.roomX === r.roomX)
            if(p){
                let tile = this.map.getTileAt(r.roomX+1, r.roomY+1, false, 'terrain')
                this.players.push(new Player(this, tile.getCenterX(), tile.getCenterY(), p.id))
            } 
            if(r.roomItem){
                this.map.putTileAt(r.roomItem, r.roomX+1, r.roomY+2, false, 'items')
            }
        })
    }

    tryShowTileInfo = () => {
        let tile = this.map.getTileAtWorldXY(
            this.input.activePointer.worldX, 
            this.input.activePointer.worldY, false, undefined, 'tiles')
        if(tile) {
            let type = Object.keys(CardTypes).find((type:TileType)=>CardTypes[type].spriteIndex === tile.index)
            //onShowTilePopup(type as TileType)
        }
    }
}