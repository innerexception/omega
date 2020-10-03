import * as React from 'react'
import { Button } from '../Shared';

interface Props {
    messages:Array<string>
}

export default class Dialog extends React.Component<Props> {

    state = { textLength: 0, currentStringIndex: 0 }

    componentWillReceiveProps(props){
        if(!props.messages[this.state.currentStringIndex]){
            this.setState({ currentStringIndex: 0})
        }
    }

    componentDidMount(){
        this.renderNextLetter()
    }

    renderNextLetter = ()=> {
        if(this.state.textLength < this.props.messages[this.state.currentStringIndex].length){
            this.setState({textLength: this.state.textLength+1})
            setTimeout(this.renderNextLetter, 100)
        }
    }

    onNextMessage = () => {
        this.setState({textLength: 0, currentStringIndex: this.state.currentStringIndex+1}, this.renderNextLetter)
    }

    getButton = () => {
        if(this.state.currentStringIndex === this.props.messages.length-1){
            // return Button(true, onHideModal, 'Next')
        }
            
        if(this.props.messages[this.state.currentStringIndex].length === this.state.textLength)
            return Button(true, this.onNextMessage, 'Next')
        if(this.props.messages[this.state.currentStringIndex].length > this.state.textLength)
            return Button(true, ()=>this.setState({textLength: this.props.messages[this.state.currentStringIndex].length}), 'Skip')
    }

    render(){
        return <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', width:'250px', height:'90px', zIndex:99, padding:'0.5em', background:'white', position:'absolute', bottom:'20px', left:'30px', border:'1px solid', borderRadius:'3px'}}>
                    <div>
                        {this.props.messages[this.state.currentStringIndex].substring(0,this.state.textLength)}
                    </div>
                    {this.getButton()}
               </div>
    }
}
