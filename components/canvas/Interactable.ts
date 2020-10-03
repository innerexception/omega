import { Scene, GameObjects } from "phaser";

export default class Interactable extends GameObjects.Sprite {

    id:string

    constructor(scene:Scene,x:number,y:number,id:string){
        super(scene, x,y, 'player')
        this.id = id
        this.setInteractive()
        scene.add.existing(this)
    }

}