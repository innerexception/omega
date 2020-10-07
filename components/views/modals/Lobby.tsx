import * as React from 'react'
import AppStyles from '../../../AppStyles';
import { Button, TileIcon } from '../../Shared';
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
            <div style={{...AppStyles.modal, justifyContent:'space-between', height:'200px'}}>
                <div>
                    <div style={{display:'flex', justifyContent:'space-between', marginTop:'5px'}}>
                        <h2>Station Prep</h2>
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
                    <div style={{display:'flex', justifyContent:'flex-end'}}>
                        <div style={{marginRight:'1em'}}>{Button(true, ()=>onCreateMatch(this.state.playerName+"'s Station", getNewPlayer(this.state.playerName, this.props.player.uid)), 'Create Station')}</div>
                        {findLowestPopMatch(this.state.matches) && 
                            Button(true, ()=>onJoinMatch(findLowestPopMatch(this.state.matches).id, getNewPlayer(this.state.playerName, this.props.player.uid)), 'Join Station')
                        }
                    </div>
                </div>
            </div>
        )
    }
}

const findLowestPopMatch = (matches:Array<Match>) => {
    let sorted = matches.filter(m=>m.players.length < 5)
    if(sorted[0]) return sorted[Phaser.Math.Between(0, sorted.length-1)]
}