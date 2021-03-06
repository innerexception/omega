import * as React from 'react'
import { Modal } from '../../enum';
import Menu from './modals/Menu';
import { connect } from 'react-redux';
import Viewscreen from './Viewscreen';
import Toolbar from './Toolbar'
import Lobby from './modals/Lobby';
import TilePopup from './modals/TilePopup';
const bg = require('../../assets/space.png')

interface Props {
    modalState?:ModalState
    match?:Match
    me?:firebase.User
}

@(connect((state: RState) => ({
    modalState: state.modalState,
    match: state.match,
    me: state.onlineAccount
})) as any)
export default class ViewscreenFrame extends React.Component<Props> {

    getModal = () => {
        let data = this.props.modalState.data
        switch(this.props.modalState.modal){
            case Modal.MENU: return <Menu/>
            case Modal.LOBBY: return <Lobby/>
        }
    }

    render(){
        const isStarted = this.props.match
        return (
            <div style={{position:'relative', display:'flex', background:'black', borderRadius:'5px', margin:'1px', backgroundImage: isStarted ? 'none' : 'url('+bg+')',
                         width: isStarted ? '' : '85%', height: isStarted ? '' : '85%'}}>
                {this.props.modalState && this.getModal()}
                <div style={{width:'100%'}}>
                    {isStarted && <Toolbar/>}
                    {isStarted && 
                        <div style={{position:'relative'}}>
                            {this.props.modalState && this.props.modalState.modal === Modal.TILE &&
                            <div style={{position:"absolute", top:'6vh', left:0,right:0,margin:'auto', height:'150px', width:'200px'}}>
                                <TilePopup item={this.props.modalState.data} />
                            </div>}
                            <Viewscreen/>
                        </div>
                    }
                </div>
            </div>
        )
    }
}