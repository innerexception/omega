import * as React from 'react'
import AppStyles from '../../../AppStyles';
import { Button, TileIcon } from '../../Shared';
import { onHideModal } from '../../uiManager/Thunks';
import { RoomItem, ItemDescriptions } from '../../../enum';
const bg = require('../../../assets/tiny.png')

interface Props {
    item:RoomItem|GraveState
}

export default class TilePopup extends React.PureComponent<Props> {

    render(){
        if((this.props.item as any).id){
            const grave = this.props.item as GraveState
            return (
                <div style={{padding:'0.5em', width:'10em', cursor:'pointer', backgroundImage:'url('+bg+')', display:"flex", alignItems:'center', borderRadius:'1em', border:'6px double white'}}>
                    <h4 style={{color:grave.color}}>Here lies {grave.name}</h4>
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