import * as React from 'react'
import AppStyles from '../../../AppStyles';
import { Button } from '../../Shared';
import { getErrorMessage } from '../../Util';
import Provider from '../../../firebase/Network';

const splash = require('../../../assets/Cryptomnesic2.png')

interface Props {}

interface State {
    email:string
    password:string
    error:string
    isLogginIn:boolean
    showLogin:boolean
}

export default class Menu extends React.Component<Props, State> {

    state = { email: '', password: '', error: '', isLogginIn: false, showLogin: true}

    trySignIn = async () => {
        try{
            this.setState({isLogginIn:true})
            await Provider.onTrySignIn(this.state.email, this.state.password)
        }
        catch(e){
            this.setState({isLogginIn:false, error: getErrorMessage(e.code)})
        }
    }

    tryCreateUser = async () => {
        try{
            this.setState({isLogginIn:true})
            await Provider.onCreateUser(this.state.email, this.state.password)
        }
        catch(e){
            this.setState({isLogginIn:false, error: getErrorMessage(e.code)})
        }
    }

    render(){
        return (
            <div style={{...AppStyles.modal, justifyContent:'space-between'}}>
                <div>
                    <h2>Borders</h2>
                    <hr/>
                    <div style={{display:'flex', alignItems:'center', justifyContent:'space-around', height:'230px'}}>
                        <div style={{backgroundImage: 'url('+splash+')', backgroundPosition:'center', width: '250px', height:'190px', border:'2px inset'}}/>
                        <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                            {this.state.error && <h4 style={{color:'gray'}}>{this.state.error}</h4>}
                            {this.state.showLogin && 
                            <div style={{width:'200px', margin:'1em', marginBottom:0}}>
                                <input style={{marginBottom:'0.5em'}} placeholder="email" type="text" onChange={(e)=>this.setState({email: e.currentTarget.value})}/>
                                <input placeholder="password" type="password" onChange={(e)=>this.setState({password: e.currentTarget.value})}/>
                                <div style={{display:'flex', justifyContent:'flex-end', marginTop:'0.5em'}}>
                                    <div style={{width:'100px'}}>{Button(!this.state.isLogginIn, this.tryCreateUser, '+New')}</div>
                                    <div style={{width:'100px', marginLeft:'1em'}}>{Button(!this.state.isLogginIn, this.trySignIn, 'Go!')}</div>
                                </div>
                            </div>}
                            <div style={{width:'100px'}}>{!this.state.showLogin && Button(true, ()=>this.setState({showLogin:true}), 'Online Play')}</div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
