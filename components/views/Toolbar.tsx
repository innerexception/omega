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
    ticks?:number
}

@(connect((state: RState) => ({
    me: state.onlineAccount,
    match: state.match,
    ticks: state.matchTicks
})) as any)
export default class Toolbar extends React.Component<Props> {

    render(){
        const activePlayer = this.props.match.players.find(p=>p.id === this.props.me.uid)
        const playerRoom = this.props.match.rooms.find(r=>r.roomX === activePlayer.roomX && r.roomY === activePlayer.roomY)
        const coreRoom = playerRoom.roomItem === RoomItem.CoreMemory
        return (
            <div style={{width:'100%'}}>
                <div style={{margin:'1em', padding:'0.3em', backgroundColor:'white', boxShadow: AppStyles.boxShadow, border: '3px double', borderRadius:'3px'}}>
                    {activePlayer.id === this.props.me.uid ? 
                        <div style={{display:'flex', justifyContent:'space-around'}}>
                            <div>
                                <h4 style={{color: activePlayer.color, textShadow:'1px 1px black'}}>{activePlayer.name}</h4>
                                <h4>{activePlayer.actions} Actions Left</h4>
                            </div>
                            <div style={{display:'flex', alignItems:"center"}}>
                                <h6>Time: {10-(this.props.ticks % 10)}</h6>
                                <div style={{marginRight:'0.5em', marginLeft:'0.5em'}}>
                                    {Button(true, onStartMove, '(M)ove')}
                                </div>
                                {!coreRoom && 
                                    <div style={{marginRight:'0.5em'}}>
                                        {Button(playerRoom.roomItem ? true : false, onSearch, '(S)earch')}
                                    </div>}
                                <div style={{marginRight:'0.5em'}}>
                                    {Button(playerRoom.airState > Air.Normal, onRepair, '(R)epair')}
                                </div>
                                {coreRoom && 
                                    <div style={{marginRight:'0.5em'}}>
                                        {Button(playersHaveKeys(playerRoom, this.props.match.players), onKillVirus, '(K)ill Virus')}
                                    </div>}
                            </div>
                            <div>
                                <h4>Inventory</h4>
                                <div style={{display:'flex', justifyContent:'space-around', height:'24px'}}>
                                    {activePlayer.inventory.map(i=>
                                        TileIcon(i) 
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
