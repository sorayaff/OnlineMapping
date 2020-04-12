import React from 'react';
import styles from './index.less';
import { connect } from 'dva';


function MapLegend(props){
  const { style_bottom, legend_discrete, legend_continuous } = props;
  const display = (legend_discrete || legend_continuous)? 'block':'none';
  const Width = (legend_discrete && legend_continuous)? '140px':'85px';
  return(	  
			<div id="legend" 
				style={{width:Width, display:display, bottom:style_bottom}} 
				className={styles.legend} 				
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
