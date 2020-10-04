import * as React from 'react'
import { RoomItem, Air, TURN_LENGTH } from '../../enum';
import { connect } from 'react-redux';
import { TileIcon, Button, TopBar, ProgressBar } from '../Shared';
import { onSearch, onRepair, onStartMove, onKillVirus, onLeaveMatch, onPassTurn } from '../uiManager/Thunks';
import AppStyles, { modalBg } from '../../AppStyles'
import { playersHaveKeys } from '../Util';
const virus = require('../../assets/logo.png')

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

    getViewComponent = () => {
        const activePlayer = this.props.match.players.find(p=>p.id === this.props.match.activePlayerId)
        const playerRoom = this.props.match.rooms.find(r=>r.roomX === activePlayer.roomX && r.roomY === activePlayer.roomY)
        const coreRoom = playerRoom && playerRoom.roomItem === RoomItem.CoreMemory

        if(this.props.match.isVictory) 
            return Button(true, onLeaveMatch, 'Mission Success')
        if(this.props.match.graves.find(g=>g.id === this.props.me.uid)) 
            return Button(true, onLeaveMatch, 'R.I.P')
        if(activePlayer.id !== this.props.me.uid)
            return <h4>{activePlayer.name}'s Turn</h4>

        return [
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginLeft:'1em', marginRight:'1em', marginBottom:'0.5em'}}>
                    <div>
                        <h4 style={{color: activePlayer.color, textShadow:'1px 1px black'}}>{activePlayer.name}</h4>
                        <h4>{activePlayer.actions} Actions Left</h4>
                    </div>
                    <div style={{display:'flex', alignItems:'center'}}>
                        <h4 style={{marginRight:'0.5em'}}>Next Virus Spread:</h4>
                        {ProgressBar(this.props.ticks % TURN_LENGTH, TURN_LENGTH, virus)}
                    </div>
                    <div>
                        <h4>Inventory</h4>
                        <div style={{display:'flex', justifyContent:'space-around', height:'24px'}}>
                            {activePlayer.inventory.map(i=>
                                TileIcon(i) 
                            )}
                        </div>
                    </div>
                </div>,
                <div style={{display:'flex', alignItems:"center",  justifyContent:'space-evenly'}}>
                    <div style={{marginRight:'0.5em', marginLeft:'0.5em'}}>
                        {Button(true, onStartMove, '(M)ove')}
                    </div>
                    {!coreRoom && 
                        <div style={{marginRight:'0.5em'}}>
                            {Button(playerRoom && playerRoom.roomItem ? true : false, onSearch, '(S)earch')}
                        </div>}
                    <div style={{marginRight:'0.5em'}}>
                        {Button(playerRoom && playerRoom.airState > Air.Normal, onRepair, '(R)epair')}
                    </div>
                    {coreRoom && 
                        <div style={{marginRight:'0.5em'}}>
                            {Button(playersHaveKeys(playerRoom, this.props.match.players), onKillVirus, '(K)ill Virus')}
                        </div>}
                    {Button(true, onPassTurn, '(P)ass')}
                    {Button(true, onLeaveMatch, 'Quit')}
                </div>
        ]
    }

    render(){
        return (
            <div style={{width:'100%'}}>
                <div style={style}>
                    <div>
                        {this.getViewComponent()}
                    </div>
                </div>
            </div>
        )
    }
}

const style = {
    backgroundImage: 'url('+modalBg+')',
    backgroundColor: 'black',
    border: '6px double',
    borderRadius:'1em',
    color:'white',
    margin:'0.5em',
    marginBottom:0,
    padding:'0.5em'
}