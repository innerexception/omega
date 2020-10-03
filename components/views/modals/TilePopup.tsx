import * as React from 'react'
import AppStyles from '../../../AppStyles';
import { CardTypes, TileType } from '../../../enum';
import { Button, TileIcon } from '../../Shared';
import { onHideModal } from '../../uiManager/Thunks';

interface Props {
    tile: TileType
}

export default class TilePopup extends React.PureComponent<Props> {

    render(){
        return (
            <div style={{position:'relative', cursor:'pointer'}}>
                {TileCard(this.props.tile, null)}
            </div>
        )
    }
}

const bg = require('../../../assets/patterns/grass.png')
export const TileCard = (type:TileType, selectedTileType?:TileType) => {
    let card = CardTypes[type]
    return (
        <div style={{width:'8em', padding:'0.5em', cursor:'pointer', border: selectedTileType === type ? '2px solid yellow' : '1px solid', backgroundImage:'url('+bg+')'}}>
            <div style={{display: 'flex', alignItems:'center'}}>
                <div style={{textAlign:'center', marginRight:'1em', width:'33%'}}>
                    <h5>{card.name}</h5>
                    {TileIcon(card.spriteIndex)}
                </div>
                <div style={{display:'flex', flexDirection:'column'}}>
                    <div>
                        {(card.bonuses as Array<TileType>).map(b=><h6>{'+ '+b}</h6>)}
                    </div>
                    <div>
                        {(card.penalties as Array<TileType>).map(b=><h6>{'- '+b+(type === TileType.City || type === TileType.Town ? ' (2 tiles)' : '')}</h6>)}
                    </div>
                </div>
            </div>
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