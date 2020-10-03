export const colors = {
    white: '#f3f3f3',
    grey1: 'silver',
    grey2: '#ababab',
    grey3:'#333333',
    black:'#252525',
    lGreen: '#87e483',
    dGreen: '#006500',
    dBrown: '#967252',
    lBrown: '#c7936d',
    lBlue: '#94caff',
    dBlue: '#0000ca',
    purple: '#360097',
    pink: '#ff0097',
    red: '#dc0000',
    orange: '#ff6500',
    ddBrown: '#392414',
    background: 'black',
}

export const modalBg = require('./assets/ui/modal.png')

export default {
    window: {
        background:colors.background,
        border: '1px solid'
    },
    windowBorder: {
        padding:'16px', background:colors.grey1, margin:'16px'
    },
    contentAreaAlternate: {
        padding:'0.5em', background: colors.grey2, border:'5px outset', borderColor:colors.grey1, borderBottomLeftRadius:'20px', borderTopRightRadius:'20px', marginBottom:'0.5em', marginTop:'0.5em'
    },
    buttonOuter: {
        color: colors.black, 
        cursor:'pointer',
        textAlign:'center' as 'center',
        border: '3px solid',
        borderRadius: '5px',
        background:'white',
        padding:'2px'
    },
    boxShadow: '5px 4px 8px 0px black',
    buttonInner: {
        border:'1px solid', borderRadius: '3px', paddingLeft:'5px', paddingRight:'5px' ,
        color: colors.black, 
        background:'white',
        cursor:'pointer'
    },
    topBar: {
        background: 'white',
        display:'flex',
        justifyContent:'space-around',
        alignItems: 'center',
        borderTopLeftRadius: '5px',
        borderTopRightRadius: '5px',
        borderBottom: '1px solid'
    },
    hr: {
        margin:0,
        marginBottom:'1px'
    },
    modal: {
        backgroundImage: 'url('+modalBg+')',
        backgroundRepeat: 'no-repeat',
        backgroundSize:'contain',
        backgroundColor: 'white',
        position:'absolute' as 'absolute',
        width: '444px',
        height: '300px',
        margin: 'auto',
        zIndex:2,
        padding:'1em',
        top:0,left:0,bottom:0,right:0
    },
    bottomBarContent: {
        background:' rgb(90, 90, 90)',
        display: 'flex',
        flexDirection: 'column' as 'column',
        justifyContent: 'flex-start',
        height: '100%',
        width:'75%'
    },
    bottomBarContentInner: {overflow:'hidden', padding:'0.5em', margin:'0.5em', background:'rgba(33, 3, 3, 0.3)', height:'100%', display:'flex', alignItems:'center', justifyContent:'space-around'},
    notifications: {
        position:'absolute' as 'absolute',
        left:0, bottom:0,
        maxWidth: '80vw',
        height: '5em',
        display:'flex',
        zIndex:2
    },
    close: {
        position:'absolute' as 'absolute', right:20, top:10, cursor:'pointer', fontSize:'18px'
    },
    bounce: {
        width:'2em',
        height:'1em',
        animation: 'shake 5s',
        animationIterationCount: 'infinite'
    }
}