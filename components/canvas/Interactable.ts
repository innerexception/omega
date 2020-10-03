import { Scene, GameObjects } from "phaser";

export default class Interactable extends GameObjects.Sprite {

    id:string

    constructor(scene:Scene,x:number,y:number,id:string, color:number, dead?:boolean){
        super(scene, x,y, dead ? 'grave' : 'player')
        this.id = id
        this.tint = color
        this.setInteractive()
        scene.add.existing(this)
    }

}