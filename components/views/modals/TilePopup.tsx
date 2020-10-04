import * as React from 'react'
import { Button, TileIcon } from '../../Shared';
import { onHideModal } from '../../uiManager/Thunks';
import { RoomItem, ItemDescriptions, PlayerColorData } from '../../../enum';
const bg = require('../../../assets/tiny.png')

interface Props {
    item:RoomItem|GraveState
}

export default class TilePopup extends React.PureComponent<Props> {

    render(){
        if((this.props.item as any).actions){
            const player = this.props.item as PlayerState
            return (
                <div style={{padding:'0.5em', width:'14em', cursor:'pointer', backgroundImage:'url('+bg+')', alignItems:'center', borderRadius:'1em', border:'6px double white'}}>
                    <h4 style={{color:player.color, textShadow:'2px 2px black'}}>{player.name}, a {PlayerColorData[player.color].title}</h4>
                    <h4>{PlayerColorData[player.color].description}</h4>
                    <div style={{display:'flex'}}>
                        <h4>Carrying:</h4>
                        {player.inventory.map(i=>TileIcon(i))}
                    </div>
                    {Button(true, onHideModal, 'Ok')}
                </div>
            )
        }
        if((this.props.item as any).id){
            const grave = this.props.item as GraveState
            return (
                <div style={{padding:'0.5em', width:'10em', cursor:'pointer', backgroundImage:'url('+bg+')', display:"flex", alignItems:'center', borderRadius:'1em', border:'6px double white'}}>
                    <h4 style={{color:grave.color, textShadow:'2px 2px black'}}>Here lies a {PlayerColorData[grave.color].title}, {grave.name}</h4>
                    {Button(true, onHideModal, 'Ok')}
                </div>
            )
        }
        const item = this.props.item as RoomItem
        return (
            <div style={{padding:'0.5em', width:'10em', cursor:'pointer', backgroundImage:'url('+bg+')', display:"flex", borderRadius:'1em', border:'6px double white'}}>
                <h4>{ItemDescriptions[item]}</h4>
                <div style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'space-around'}}>
                    {TileIcon(item)}
                    {Button(true, onHideModal, 'Ok')}
                </div>
            </div>
        )
    }
}