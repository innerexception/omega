import * as React from 'react'
import { TileType, CardTypes } from '../../enum';
import { connect } from 'react-redux';
import { TileIcon, Button, TopBar } from '../Shared';
import { onStartPlaceBorders, onCancelBorders, onLeaveMatch } from '../uiManager/Thunks';
import AppStyles, { modalBg } from '../../AppStyles'
import { TileCard } from './modals/TilePopup';

interface Props {
    players?:Array<PlayerState>
    deck?: Array<TileType>
    placingBorders?:boolean
    activePlayerId?:string
    me?:firebase.User
    selectedTileType?: TileType
    daily?:number
}

@(connect((state: RState) => ({
    me: state.onlineAccount,
    players: state.match.players
})) as any)
export default class Toolbar extends React.Component<Props> {

    render(){
        return (
            <div style={{width:'320px'}}>
                <div style={{display:"flex", margin:'1em', paddingTop:'1em', backgroundColor:'white', boxShadow: AppStyles.boxShadow, border: '3px double', borderRadius:'3px'}}>
                    
                </div>
            </div>
        )
    }
}
