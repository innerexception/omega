import * as React from 'react'
import * as Phaser from 'phaser'
import RoomScene from '../canvas/RoomScene'
import AppStyles from '../../AppStyles'

interface Props {
    
}

interface State {
    phaserInstance: Phaser.Game | null
}

export default class Viewscreen extends React.Component<Props, State> {

    state = {
        phaserInstance: null,
        containerRef: React.createRef<HTMLDivElement>()
    }

    componentWillUnmount(){
        (this.state.phaserInstance as Phaser.Game).scene.scenes[0].unsubscribeRedux()
        this.state.phaserInstance.destroy(true)
    }

    componentDidMount() {
        this.state.phaserInstance = new Phaser.Game({
            type: Phaser.WEBGL,
            width: this.state.containerRef.current.clientWidth,
            height: this.state.containerRef.current.clientHeight,
            parent: 'canvasEl',
            physics: {
                default: 'arcade',
                arcade: {
                    debug: false,
                }
            },
            render: {
                pixelArt: true
            },
            scene: [
                new RoomScene({key: 'map'})
            ]
        })
        window.addEventListener("resize", ()=>{
            let game = (this.state.phaserInstance as Phaser.Game)
            game.canvas.width = this.state.containerRef.current.clientWidth
            game.canvas.height = this.state.containerRef.current.clientHeight
        });
    }

    render() {
        return <div ref={this.state.containerRef} id='canvasEl' style={{width:'1024px', height:'768px', boxShadow: AppStyles.boxShadow, maxHeight:'80vh', maxWidth:'60vw', border:'1px solid black', borderRadius:'3px', overflow:'hidden', margin:'1em'}}/>
    }
}