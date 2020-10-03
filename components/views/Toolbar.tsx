import * as React from 'react'
import { RoomItem } from '../../enum';
import { connect } from 'react-redux';
import { TileIcon, Button, TopBar } from '../Shared';
import { onSearch, onRepair, onStartMove, onKillVirus } from '../uiManager/Thunks';
import AppStyles, { modalBg } from '../../AppStyles'

interface Props {
    match?:Match
    me?:firebase.User
}

@(connect((state: RState) => ({
    me: state.onlineAccount,
    match: state.match
})) as any)
export default class Toolbar extends React.Component<Props> {

    render(){
        const activePlayer = this.props.match.players.find(p=>p.id === this.props.me.uid)
        const coreRoom = this.props.match.rooms.find(r=>r.roomX === activePlayer.roomX && r.roomY === activePlayer.roomY && r.roomItem === RoomItem.CoreMemory)
        const playersInRoom = this.props.match.players.filter(p=>p.roomX === coreRoom.roomX && p.roomY === coreRoom.roomY)
        const playersInventory = playersInRoom.map(p=>p.inventory).reduce((acc, val)=>acc.concat(val), [])
        const playersHaveKeys = playersInventory.includes(RoomItem.BlueSphere) && playersInventory.includes(RoomItem.GreenSphere) && playersInventory.includes(RoomItem.PurpleSphere) && playersInventory.includes(RoomItem.RedSphere)
        return (
            <div style={{width:'320px'}}>
                <div style={{display:"flex", margin:'1em', paddingTop:'1em', backgroundColor:'white', boxShadow: AppStyles.boxShadow, border: '3px double', borderRadius:'3px'}}>
                    {activePlayer.id === this.props.me.uid ? 
                        <div>
                            <div>
                                <h4>{activePlayer.actions} Actions Left</h4>
                                {Button(true, onStartMove, '(M)ove')}
                                {Button(true, onSearch, '(S)earch')}
                                {Button(true, onRepair, '(R)epair')}
                                {coreRoom && Button(playersHaveKeys, onKillVirus, '(K)ill Virus')}
                            </div>
                            <div>
                                <h4>Inventory</h4>
                                <div style={{display:'flex', justifyContent:'space-around'}}>
                                    {activePlayer.inventory.map(i=>
                                        {TileIcon(i)}    
                                    )}
                                </div>
                            </div>
                        </div>
                         : 
                        <h4>{activePlayer.name}'s Turn</h4>
                    }
                </div>
            </div>
        )
    }
}
