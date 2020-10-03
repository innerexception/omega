import * as React from 'react';
import { colors } from '../../AppStyles'
import ViewscreenFrame from '../views/ViewscreenFrame';

export default class AppContainer extends React.Component {

    render(){
        return (
            <div style={styles.frame}>
                <ViewscreenFrame />
            </div>
        )
    }
}

const styles = {
    frame: {
        height: '100vh',
        background: colors.background,
        overflow:'hidden',
        display:'flex',
        alignItems:'center',
        justifyContent: 'center'
    },
    dot: {
        height:'0.5em',
        width:'0.5em',
        borderRadius: '0.5em'
    },
    statusDot: {
        position:'absolute' as 'absolute', bottom:'0.5em', right:'0.5em',
        display:'flex',
        color: colors.black,
        alignItems:'center'
    }
}