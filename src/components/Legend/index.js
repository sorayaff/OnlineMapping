import React, {PureComponent} from 'react';
import styles from './index.less';
import classNames from 'classnames';
import pic from './colorbar.jpg';
// import ReactGradientColorPicker from 'react-gradient-color-picker';
//import GradientBuilder from '../GradientBuilder/GradientBuilder';
import ReactGradientColorPicker from '@components/react-gradient-picker';
import {
  Radio,
  Tabs,
  Slider,
  InputNumber,
  TreeSelect,
  Row,
  Col,
  Input,
  Icon,
} from 'antd';

const colorbar={
  "name": "land_use",
  "type": "discrete",
  "colors":[
    [
      0,
      "#f7cf94"
    ],
    [
      0.125,
      "#076c07"
    ],
    [
      0.25,
      "#808000"
    ],
    [
      1.0,
      "#08306b"
    ]
  ],
  "legend": [
    [
      0,
      "耕地"
    ],
    [
      0.125,
      "草地"
    ],
    [
      1.0,
      "建筑用地"
    ]
  ]
}


class Legend extends PureComponent{
  constructor(props){
    super(props);
    this.state={

    }
  }

  newArray(colorbar){

  }


  render(){
    console.log("colorbar",colorbar,colorbar["legend"],colorbar["legend"][1][1]);
    var tempColor;
    var tempFont;
    var tempMargintop;
    var temp = 1+10/160;
    // var temp = 20;
    var tempLegend=new Array(colorbar["legend"].length);
    for(var i = 0;i<colorbar["legend"].length;i++)
    {
      tempLegend[tempLegend.length-i-1] = new Array(2);
      tempLegend[tempLegend.length-i-1][0]=colorbar["legend"][i][0];
      tempLegend[tempLegend.length-i-1][1]=colorbar["legend"][i][1];
    }

    return(
    <div>
      <div className={classNames(styles['card-container'])}>
        {colorbar["legend"].map(item1=>
        {tempColor=colorbar["colors"].find(item2=>item2[0]==item1[0]);
         tempColor=tempColor[1];
         tempFont=item1[1];
          return(
            <Row>
             <div className={classNames(styles['rectangle'])} style={{backgroundColor:tempColor,float:"left"}}></div>
             <div className={classNames(styles['rectangleFont'])}>{tempFont}</div>
            </Row>
          )})}
      </div>
      <div className={classNames(styles['card-container3'])}>
        <Row>
          <div className={classNames(styles['card-container2'])}>
              <div style={{float:"left", position:"relative"}}><img className={classNames(styles['pic'])} src={pic}></img></div>
          </div>
        <div>
          {tempLegend.map(item=>
          {tempMargintop=((temp-item[0])*160)+"px";
            temp = item[0]-20/160;
            return(<p className={classNames(styles['text'])} style={{paddingTop:tempMargintop}}>{item[1]}</p>)})}
          {/*tempMargintop=(((1-item[0])*160+20)/200)*100+"%";*/}
          {/*  return(<p className={classNames(styles['text'])} style={{top:tempMargintop}}>{item[1]}</p>)})}*/}
        </div>
      </Row>
      </div>
    </div>
    );
  }
}

export default Legend;
