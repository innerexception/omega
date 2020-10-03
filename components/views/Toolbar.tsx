import * as React from 'react'
import { RoomItem, Air } from '../../enum';
import { connect } from 'react-redux';
import { TileIcon, Button, TopBar } from '../Shared';
import { onSearch, onRepair, onStartMove, onKillVirus } from '../uiManager/Thunks';
import AppStyles, { modalBg } from '../../AppStyles'
import { playersHaveKeys } from '../Util';

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
        const playerRoom = this.props.match.rooms.find(r=>r.roomX === activePlayer.roomX && r.roomY === activePlayer.roomY)
        const coreRoom = playerRoom.roomItem === RoomItem.CoreMemory
        return (
            <div style={{width:'320px'}}>
                <div style={{display:"flex", margin:'1em', paddingTop:'1em', backgroundColor:'white', boxShadow: AppStyles.boxShadow, border: '3px double', borderRadius:'3px'}}>
                    {activePlayer.id === this.props.me.uid ? 
                        <div>
                            <div>
                                <h4>{activePlayer.actions} Actions Left</h4>
                                {Button(true, onStartMove, '(M)ove')}
                                {!coreRoom && Button(playerRoom.roomItem ? true : false, onSearch, '(S)earch')}
                                {Button(playerRoom.airState > Air.Normal, onRepair, '(R)epair')}
                                {coreRoom && Button(playersHaveKeys(playerRoom, this.props.match.players), onKillVirus, '(K)ill Virus')}
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
