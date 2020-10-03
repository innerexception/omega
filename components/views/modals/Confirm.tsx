import * as React from 'react'
import AppStyles from '../../../AppStyles';
import { Button } from '../../Shared';
import { onCancelBorders, onHideModal, onSaveBorder } from '../../uiManager/Thunks';

interface Props {
    border: Array<Tuple>
}

export default class Confirm extends React.PureComponent<Props> {

    render(){
        return (
            <div style={{...AppStyles.modal, justifyContent:'space-between'}}>
                <div>
                    <h2>Confirm Borders</h2>
                    <hr/>
                    <h4 style={{marginBottom:'4em'}}>Are these the borders of your nation? You can't change or redraw them again. Only objects inside your borders count towards your score.</h4>
                    <div style={{display:'flex', justifyContent:'flex-end', paddingTop:'5px'}}>
                        <div style={{width:'100px', marginRight:'0.5em'}}>{Button(true, ()=>onSaveBorder(this.props.border), 'Ok')}</div>
                        <div style={{width:'100px'}}>{Button(true, onCancelBorders, 'Cancel')}</div>
                    </div>
                </div>
            </div>
        )
    }
}
