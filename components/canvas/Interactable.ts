import { Scene, GameObjects } from "phaser";

export default class Interactable extends GameObjects.Sprite {

    id:string

    constructor(scene:Scene,x:number,y:number,id:string, color:number){
        super(scene, x,y, 'player')
        this.id = id
        this.tint = color
        scene.add.existing(this)
    }

}