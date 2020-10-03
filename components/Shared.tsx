import * as React from 'react'
import AppStyles, { colors } from '../AppStyles'
import { Icons, CSSTiles } from '../assets/Assets';

export const TopBar = (text:string|JSX.Element) => 
    <div style={AppStyles.topBar}>
        <div style={{width:'33%'}}><hr style={AppStyles.hr}/><hr style={AppStyles.hr}/><hr style={AppStyles.hr}/><hr style={AppStyles.hr}/></div>
            {text}
        <div style={{width:'33%'}}><hr style={AppStyles.hr}/><hr style={AppStyles.hr}/><hr style={AppStyles.hr}/><hr style={AppStyles.hr}/></div>
    </div>

export const Button = (enabled:boolean, handler:any, text:JSX.Element | string) => 
    <div style={{...AppStyles.buttonOuter, pointerEvents: enabled ? 'all' : 'none'}} 
        onClick={handler}>
        <div style={{...AppStyles.buttonInner, opacity: enabled ? 1 : 0.5}}>{text}</div>
    </div>

export const ToggleButton = (state:boolean, handler:any, text:JSX.Element | string) => 
    <div style={{...AppStyles.buttonOuter, color:state ? 'white' : 'black', background:state?'black':'white'}} 
        onClick={handler}>
        <div style={{...AppStyles.buttonInner}}>{text}</div>
    </div>

export const RangeSpinner = (value:number, onValueChange:Function, leftLabel:string, rightLabel:string, disabled:boolean, max:number, min:number, inc:number) =>
    <div style={{display:'flex', justifyContent:'space-between', opacity: disabled ? '0.5' : '1'}}>
        <h5 style={{width:rightLabel ? '25%' : '33%', textAlign:'left', marginRight:'5px'}}>{leftLabel}</h5>
        <div style={{width:rightLabel?'50%' : '66%', display:'flex'}}>
            <div onClick={()=>onValueChange(value-inc)} style={{pointerEvents:value >= min ? 'all' : 'none'}}>{'<'}</div>
            <div style={{border:'3px ridge', position:'relative', width:'100%'}}>
                <div style={{position:'absolute', top:0,left:0, width: ((value/max)*100)+'%', background:'white'}}/>
            </div>
            <div onClick={()=>onValueChange(value+inc)} style={{pointerEvents:value <= max ? 'all' : 'none'}}>{'>'}</div>
        </div>
        <h5 style={{width:rightLabel ? '25%' : 0, textAlign:'right', marginLeft:'5px'}}>{rightLabel}</h5>
    </div>

export const LightButton = (enabled:boolean, handler:any, text:string, tab?:boolean) => 
    <div onClick={handler} style={{...AppStyles.buttonInner, opacity: enabled ? 1 : 0.5, pointerEvents: enabled ? 'all' : 'none', 
        textAlign:'center', borderBottom: tab && !enabled ? '1px dashed':'1px solid', borderBottomLeftRadius: tab?0:'3px', borderBottomRightRadius:tab?0:'3px', marginBottom: tab ? '-1px' : 0}}>{text}</div>

// export const Warning = (handler:any, icon:string, color:string) => 
//     <div onClick={handler} style={{...AppStyles.buttonInner, ...AppStyles.bounce, backgroundColor:color, color:'red', position:'absolute', top:-35, right:10, border:'none' }}>{Icon(icon, '')}!</div>
    
export const RangeInput = (value:number, onValueChange:Function, leftLabel:JSX.Element | string, rightLabel?:JSX.Element | string, disabled?:boolean, max?:number, min?:number, inc?:number) => 
    <div style={{display:'flex', justifyContent:'space-between', opacity: disabled ? '0.5' : '1'}}>
        {leftLabel && <h5 style={{textAlign:'left', marginRight:'5px', width:'20%'}}>{leftLabel}</h5>}
        <input disabled={disabled} onChange={(e)=>onValueChange(e.currentTarget.value)} style={{width: typeof rightLabel !== 'undefined' ? '60%' : '80%'}} max={max || 100} min={min || 0} step={inc || 5} type='range' value={value}/>
        {typeof rightLabel !== 'undefined' && <h5 style={{textAlign:'right', marginLeft:'5px', width:'20%'}}>{rightLabel}</h5>}
    </div>

export const NumericInput = (value:number, onValueChange:Function, max?:number, min?:number) => 
    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        {LightButton(min || min===0 ? value > min:true, ()=>onValueChange(value-1),'<')}
        <div style={{width:'2em', textAlign:"center"}}>{value}</div>
        {LightButton(max ? value < max:true, ()=>onValueChange(value+1),'>')}
    </div>

export const Select = (value:any, onValueChange:Function, values: Array<any>) => 
    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        {LightButton(values.findIndex(v=>v===value) > 0, ()=>onValueChange(values[values.findIndex(v=>v===value)-1]),'<')}
        <div style={{textAlign:"center", backgroundColor:value}}>{value}</div>
        {LightButton(values.findIndex(v=>v===value) < values.length-1, ()=>onValueChange(values[values.findIndex(v=>v===value)+1]),'>')}
    </div>

export const ColorSelect = (value:string, onValueChange:Function, values: Array<string>) => 
    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        {LightButton(values.findIndex(v=>v===value) > 0, ()=>onValueChange(values[values.findIndex(v=>v===value)-1]),'<')}
        <div style={{backgroundColor:value, width:'2em', height:'2em'}}/>
        {LightButton(values.findIndex(v=>v===value) < values.length-1, ()=>onValueChange(values[values.findIndex(v=>v===value)+1]),'>')}
    </div>

export const IconSelect = (value:string, onValueChange:Function, values: Array<string>) => 
    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        {LightButton(values.findIndex(v=>v===value) > 0, ()=>onValueChange(values[values.findIndex(v=>v===value)-1]),'<')}
        {Icon(value ? value : values[0], false)}
        {LightButton(values.findIndex(v=>v===value) < values.length-1, ()=>onValueChange(values[values.findIndex(v=>v===value)+1]),'>')}
    </div>

export const ProgressBar = (value:number, max:number, bg) => 
    <div style={{width:'85%', height:'10px', border:'1px solid'}}>
        <div style={{background:'url('+bg+')', width:Math.round((value/max)*100)+'%', height:'100%'}}/>
    </div>

// export const Scale = (percent:number, leftColor:string, rightColor:string, tooltipLeft:JSX.Element, tooltipRight:JSX.Element) => 
//     <div style={{width:'100%', height:'100%', display:'flex'}}>
//         <Tooltip placement="bottom" trigger={tooltipLeft ? ['hover'] : []} overlay={tooltipLeft}>
//             <div style={{background:leftColor, width:percent+'%', transition:'width 500ms', height:'100%', borderRight:'3px solid gray'}}>
//                 <div style={{backgroundImage:'url('+require('../assets/voter.png')+')', width:'25px', height:'25px', backgroundSize:'contain'}}/>
//             </div>
//         </Tooltip>
//         <Tooltip placement="bottom" trigger={tooltipRight ? ['hover'] : []} overlay={tooltipRight}>
//             <div style={{height:'100%', width:100-percent+'%', transition:'width 500ms', background:rightColor, position:"relative"}}>
//                 <div style={{backgroundImage:'url('+require('../assets/donor.png')+')', width:'25px', height:'25px', backgroundSize:'contain', position:"absolute", right:10}}/>
//             </div>
//         </Tooltip>
//     </div>
    
export const Icon = (iconName:string, large:boolean) => 
    <div style={{cursor:'pointer', 
        width:large ? '32px' : '20px', 
        height: large ? '32px' : '20px', 
        backgroundImage: 'url('+Icons[iconName]+')', 
        backgroundPosition:'center',
        backgroundRepeat:'no-repeat', 
        backgroundSize: 'contain', 
        display:'inline-block'}}/>

export const TileIcon = (iconName:number) => 
    <div style={{cursor:'pointer', 
        width:'16px', 
        height: '16px', 
        backgroundImage: 'url('+CSSTiles+')', 
        backgroundPosition: -(iconName % 7)*16+'px '+-(Math.floor(iconName/7))*16+'px', 
        backgroundRepeat:'no-repeat',
        transform:'scale(1.5)',
        display:'inline-block'}}/>
