import React,{ useState} from 'react';
import styles from './index.less';
import { connect } from 'dva';


function MapLegend(props){
  const { style_bottom, legend_discrete, legend_continuous } = props;
  const display = (legend_discrete || legend_continuous)? 'block':'none';
  const Width = (legend_discrete && legend_continuous)? '140px':'85px';
  
  const [translateX, setX] = useState(0);
  const [translateY, setY] = useState(0);
  const [lastX, setLastX] = useState(null);
  const [lastY, setLastY] = useState(null);
  const [moving, setMoving] = useState(false);
  const onMouseDown = e => {
        //e.stopPropagation();
        setMoving(true);		
    }
	
  const onMouseUp = e => {
        setMoving(false);
		setLastX(null);
		setLastY(null);
    }	
  
  const onMouseMove = (e) => {
		if(!moving) return;
		console.log('MouseMove moving:'+moving);
		console.log()
		if(lastX && lastY) {
            let dx = e.clientX - lastX;
            let dy = e.clientY - lastY;
            setX(translateX + dx);
			setY(translateY + dy);
        }
        setLastX (e.clientX);
        setLastY (e.clientY);
  }
  const strTransform ='translate('+translateX+'px,'+translateY+'px)';	
  
  return(	  
			<div id="legend" 
				style={{width:Width, display:display, bottom:style_bottom,
						transform:strTransform
						}} 
				className={styles.legend} 			
				onMouseDown={onMouseDown}	
				onMouseUp={onMouseUp}
				onMouseMove={onMouseMove}
			>
			    <h4 align="center">Legend</h4>		
				{legend_continuous &&
				<div style={{position: 'relative'}}>
				    <div className={styles.continuous}	/>	
					<div style={{position: 'absolute',right: '0px',top:'0px'}}>500</div>
					<div style={{position: 'absolute',right: '15px',top:'63px'}}>0</div>
				</div>				}				
				{legend_discrete &&
				<div style={{position: 'relative'}}>
					<div><span style={{background: 'rgb(100,30,30)'}}/>500</div>
					<div><span style={{background: 'rgb(222,20,20)'}}/>100</div>
					<div><span style={{background: 'rgb(229,131,8)'}}/>10</div>
					<div><span style={{background: 'rgb(237,222,139)'}}/>0</div>
				</div>	}				
			</div>
		
  );
}
export default connect(({ onlineMapping }) => ({
  onlineMapping,
}))(MapLegend);
