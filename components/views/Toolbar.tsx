import * as React from 'react'
import { RoomItem, Air, TURN_LENGTH, PlayerColorData, PlayerColors } from '../../enum';
import { connect } from 'react-redux';
import { TileIcon, Button, TopBar, ProgressBar, Icon } from '../Shared';
import { onSearch, onRepair, onStartMove, onKillVirus, onLeaveMatch, onPassTurn, onDepositSpheres } from '../uiManager/Thunks';
import { modalBg } from '../../AppStyles'
import Tooltip from 'rc-tooltip';
const virus = require('../../assets/bg.png')
const emptySphere = require('../../assets/emptySphere.png')

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
                <div style={{display:'flex', alignItems:'center', marginBottom:'0.5em'}}>
                    <div style={{background:'gray', padding:'5px', border:'1px solid', marginRight:'1em'}}>
                        <Tooltip placement="bottom" mouseEnterDelay={1} overlay={<h5>{PlayerColorData[activePlayer.color].description}</h5>}>
                            <h4 style={{color: activePlayer.color, textShadow:'2px 2px black', cursor:'pointer'}}>
                                {activePlayer.name} : {PlayerColorData[activePlayer.color].title}
                            </h4>
                        </Tooltip>
                        <h4 style={{textShadow:'2px 2px black'}}>{activePlayer.actions} Actions Left</h4>
                    </div>
                    <div style={{background:'gray', padding:'5px', border:'1px solid', marginRight:'1em'}}>
                        <h4 style={{textShadow:'2px 2px black'}}>Spheres</h4>
                        <div style={{display:'flex', justifyContent:'space-around', height:'24px'}}>
                            {new Array(activePlayer.color === PlayerColors[2] ? 4 : 1).fill({}).map((p,i)=>
                                activePlayer.inventory[i] ? TileIcon(activePlayer.inventory[i]) : Icon(emptySphere, false)
                            )}
                        </div>
                    </div>
                    <div style={{background:'gray', padding:'5px', border:'1px solid'}}>
                        <h4 style={{marginRight:'0.5em', textShadow:'2px 2px black',}}>Next Virus Attack:</h4>
                        {ProgressBar(this.props.ticks % TURN_LENGTH(activePlayer.color), TURN_LENGTH(activePlayer.color), virus)}
                    </div>
                </div>,
                <div style={{display:'flex', alignItems:"center", justifyContent:'space-between'}}>
                    <div style={{marginRight:'0.5em'}}>
                        {Button(true, onStartMove, '(M)ove')}
                    </div>
                    {!coreRoom && 
                        <div style={{marginRight:'0.5em'}}>
                            {Button(playerRoom && playerRoom.roomItem && hasRoom(activePlayer) ? true : false, onSearch, '(U)pload', 'Upload a decryption sphere found in this room. Only the droid can carry more than 1 at a time.')}
                        </div>}
                    {playerRoom && playerRoom.airState > Air.Normal && 
                        <div style={{marginRight:'0.5em'}}>
                            {Button(true, onRepair, '(R)epair', 'Repair damage to this room. Free for engineers.')}
                        </div>}
                    {coreRoom && 
                        <div style={{marginRight:'0.5em'}}>
                            {Button(this.props.match.spheres.length === 4, onKillVirus, '(K)ill Virus', 'With all 4 decryption spheres in hand, destroy the virus.')}
                        </div>}
                    {coreRoom && activePlayer.inventory.length > 0 &&
                        <div style={{marginRight:'0.5em'}}>
                            {Button(true, ()=>onDepositSpheres(), '(D)eposit Spheres', 'Drop off a carried sphere. Return once all 4 have been delivered.')}
                        </div>}
                        <div style={{marginRight:'0.5em'}}>{Button(true, onPassTurn, '(P)ass', 'Skip your turn')}</div>
                    {Button(true, onLeaveMatch, '(Q)uit', 'Exit the station')}
                </div>
        ]
    }

    render(){
        const activePlayer = this.props.match.players.find(p=>p.id === this.props.match.activePlayerId)
        return (
            <div style={{display:'flex', justifyContent:"center"}}>
                <div style={{...style, backgroundColor: activePlayer.color}}>
                    <div>
                        {this.getViewComponent()}
                    </div>
                </div>
            </div>
        )
    }
}

const hasRoom = (player:PlayerState) => {
    if(player.color === PlayerColors[2]) return true
    else return player.inventory.length === 0
}

const style = {
    backgroundImage: 'url('+modalBg+')',
    backgroundBlendMode:'hard-light',
    color:'white',
    border:'2px solid',
    borderRadius:'1em',
    marginBottom:0,
    padding:'0.5em'
}