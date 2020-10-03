import * as React from 'react'
import AppStyles from '../../../AppStyles';
import { Button, TileIcon } from '../../Shared';
import { onHideModal } from '../../uiManager/Thunks';

interface Props {
}

export default class TilePopup extends React.PureComponent<Props> {

    render(){
        return (
            <div style={{position:'relative', cursor:'pointer'}}>

            </div>
        )
    }
}

const bg = require('../../../assets/patterns/grass.png')
export const TileCard = () => {
    return (
        <div style={{width:'8em', padding:'0.5em', cursor:'pointer', backgroundImage:'url('+bg+')'}}>
            
        </div>
    )
}
    
const styles = {
    position:'absolute' as 'absolute',
    width: '244px',
    height: '200px',
    margin: 'auto',
    zIndex:2,
    top:0,left:0,bottom:0,right:0,
}