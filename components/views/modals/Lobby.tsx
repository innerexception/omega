import * as React from 'react'
import AppStyles from '../../../AppStyles';
import { Button } from '../../Shared';
import { onCreateMatch, onJoinMatch } from '../../uiManager/Thunks';
import { getNewPlayer } from '../../Util';
import Provider from '../../../firebase/Network';
import { connect } from 'react-redux';

interface Props {
    player?: firebase.User
}

interface State { 
    playerName:string
    matches: Array<Match>
    selectedMatch: Match
    unsubscribe: Function
}

@(connect((state: RState) => ({
    player: state.onlineAccount
})) as any)
export default class Lobby extends React.Component<Props,State> {
    state = { 
        playerName: this.props.player.displayName||'New Player', 
        matches: new Array<Match>(),
        selectedMatch: null,
        unsubscribe: null
    }

    componentDidMount = async () => {
        let unsubscribe = await Provider.fetchAndSubscribeMatches((matches:Array<Match>)=>this.setState({matches}))
        this.setState({unsubscribe})
    }

    componentWillUnmount(){
        this.state.unsubscribe && this.state.unsubscribe()
    }

    getBorder = (m:Match) => {
        if(this.state.selectedMatch){
           if(m.id === this.state.selectedMatch.id) return '2px dotted'
        }
        return 'none'
    }

    render(){
        return (
            <div style={{...AppStyles.modal, justifyContent:'space-between'}}>
                <div>
                    <div style={{display:'flex', justifyContent:'space-between', marginTop:'5px'}}>
                        <h2>Matches</h2>
                        <div style={{width:'100px'}}>{Button(true, ()=>Provider.logoutUser(), 'Logout')}</div>
                    </div>
                    <hr/>
                    <h6>Handle</h6>
                    <div style={{display:'flex'}}>
                        <input placeholder='edit your name...' 
                           value={this.state.playerName}
                           onChange={(e)=>this.setState({playerName: e.currentTarget.value})}/>
                        <div style={{marginLeft:'1em'}}>{Button(this.state.playerName !== this.props.player.displayName, ()=>Provider.onEditHandle(this.state.playerName), 'Set')}</div>
                    </div>
                    <hr/>
                    <div style={{height:'4em', overflow:'auto', marginBottom:'0.5em'}}>
                        {this.state.matches.filter(m=>!m.isStarted).map(m=>
                            <div onClick={()=>this.setState({selectedMatch: m})} 
                                 style={{cursor:'pointer', border: this.getBorder(m)}}>
                                <h5>{m.players.length} Nations</h5>
                            </div>
                        )}
                    </div>
                    <div style={{display:'flex', justifyContent:'flex-end'}}>
                        <div style={{width:'100px', marginRight:'0.5em'}}>{Button(true, ()=>onCreateMatch(this.state.playerName+"'s Match", getNewPlayer(this.state.playerName, this.props.player.uid)), 'Create')}</div>
                        <div style={{width:'100px'}}>{Button(this.state.selectedMatch?true:false, ()=>onJoinMatch(this.state.selectedMatch.id, getNewPlayer(this.state.playerName, this.props.player.uid)), 'Join')}</div>
                    </div>
                </div>
            </div>
        )
    }
}
