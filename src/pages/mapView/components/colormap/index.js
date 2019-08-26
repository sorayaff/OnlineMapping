import React, {PureComponent} from 'react';
import styles from './index.less';
import classNames from 'classnames';
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
import { connect } from 'react-redux';
import headerRequest from '@/utils/HeaderRequest';


const {TabPane} = Tabs;
var count = 0;
var ddd;
//var colorPicker = require('react-gradient-color-picker');
const {TreeNode} = TreeSelect;
const IconText = ({type, handleClick}) => (
  <span>
    <Icon type={type} onClick={handleClick}/>
  </span>
);
const zdy = [
  {key:"1",name:"1"},
  {key:"2",name:"2"},
];
const xtnz = [
  {key:"3",name:"3"},
  {key:"4",name:"4"},
];

@connect(({mapView, loading}) => ({
  fetchDataLoading: loading.effects['mapView/fetchDefaultColorbar'],
  mapView,
}))

class Colormap extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      displayCreatPage: 'block',
      creatButton:false,
      requireImageQuery:{length:10},//请求瓦片
      createColorBarQuery: {length:10},
      key:0,
      selectValue:undefined,
      inputBarNum:2,
      inputValueGamma:0.8,
      inputValueSaturation:0,
      inputValueContrast:0,
      inputValueBias:0,
      displayColorPicker:false,
      inputFormula:undefined,
      colorbarName:undefined,
      type2:'continuous',
      defaults:null,
      stops:[
        {offset: 0.0, color: '#f00', opacity: 1.0},
        {offset: 0.5, color: '#fff', opacity: 1.0},
        {offset: 1.0, color: '#0f0', opacity: 1.0}
      ],
    };
    this.handleClick = this.handleClick.bind(this);
  }



  formulaOnChange = value => {
    let temp = this.state.requireImageQuery;
    temp['index_formula'] = this.state.inputFormula;
    this.setState({
      requireImageQuery:temp,
    })
    console.log(this.state.requireImageQuery);
  }


  GammaOnChange = value => {
    let temp = this.state.requireImageQuery;
    temp['gamma'] = value;
    this.setState({
      inputValueGamma: value,
      requireImageQuery: temp,
    });
    console.log(this.state.requireImageQuery);
  };
  SaturationOnChange = value => {
    if (Number.isNaN(value)) {
      return;
    }
    let temp = this.state.requireImageQuery;
    temp['saturation'] = value;
    this.setState({
      inputValueSaturation: value,
      requireImageQuery:temp,
    });
  };
  ContrastOnChange = value => {
    if (Number.isNaN(value)) {
      return;
    }
    let temp = this.state.requireImageQuery;
    temp['contrast'] = value;
    this.setState({
      inputValueContrast: value,
      requireImageQuery:temp,
    });
  };
  BiasOnChange = value => {
    if (Number.isNaN(value)) {
      return;
    }
    let temp = this.state.requireImageQuery;
    temp['bias'] = value;
    this.setState({
      inputValueBias: value,
      requireImageQuery:temp,
    });
  };


  handleClick() {
    console.log('show');
    this.setState(prevState =>({
      displayColorPicker: !prevState.displayColorPicker,
    }));
  }
  handleClickShow(){
    // this.setState(prevState=>({
    //   displayWholeTab:!prevState.displayWholeTab,
    // }))
  }

  renderZDY=(item)=>{
    return(
      <TreeNode
        value={item}
        title={item}
        key={item}/>)
  };
  renderXTNZ=({key,name})=>{
    return(
      <TreeNode
        value={name}
        title={name}
        key={key}/>)
  };
  selectOnChange=value=>{
    console.log('select');
    let temp = this.state.requireImageQuery;
    temp['selectColorBar'] = value;
    this.setState({
        selectValue:value,
        requireImageQuery:temp,
      }
    )
  }

  colorOnChange=(stops,type)=>{
    count = count+1;
    console.log(count,'stopsss',stops);
    if(stops)
    {
      this.setState({
        stops:stops,
        type:type,
      })
      console.log(this.state.stops);
      console.log('type',this.state.type);
    }

  }

  submitColorbarOnClick(colorStops){
    console.log('dd');
    let s = this.state.stops;
    console.log(this.state.stops);
    let v = this.state.CorDValue;
    console.log(this.state.CorDValue);
    let n = this.state.colorbarName;
    console.log(this.state.colorbarName);
    if(s) {
      let i = 0;
      var ss = { length: s.length };
      while (i < s.length) {
        ss[i] = new Array(2);
        ss[i][0] = s[i]['offset'];
        ss[i][1] = s[i]['color'];
        i++;
        console.log(ss);
      }
      let temp = this.state.createColorBarQuery;
      temp['colors'] = ss;
      temp['type'] = v;
      temp['name'] = n;
      temp['type'] = this.state.type2;
      this.setState({
        createColorBarQuery:temp,
      })
      console.log(temp);
      console.log(this.state.createColorBarQuery);
      console.log(this.state);
    }

    console.log(this.state.createColorBarQuery);
  }

  typeOnChange=e=>{
    console.log('radio checked', e.target.value);
    let k = e.target.value;
    console.log(this.state.type2);
    console.log(k);
    if(k)
    {
      this.setState({
        type2: k,
      });
    }

    console.log(this.state.type2)

  }

  nameOnChange=value=>{
    if(value)
    {
      this.setState({
        colorbarName:value,
      })
    }
    console.log(this.state.colorbarName);
  }




  render()
  {
    //控制Leftpanel是否显示；控制Leftpanel关闭；model层；数据列表加载状态


    const { inputValueGamma } = this.state;
    const { inputValueSaturation } = this.state;
    const { inputValueContrast } = this.state;
    const { inputValueBias } = this.state;
    const { inputFormula } = this.state;
    // const { stops } = this.state;

    function getDefaultColorbar() {
      return headerRequest({
        url: 'v1.0/api/colormap/default',
        method: 'GET',
      });
    }

    var dd;
    let d = getDefaultColorbar();
    console.log("d",d);

    let defaultColorbar = getDefaultColorbar().then(function(data) {
      console.log("promiseData:");
      console.log(data);
      if(data.data){
        ddd = data.data['list'];
        console.log(ddd);
      }
    });

    console.log("defaults",this.state.defaults);
    var style = {
      width: '100px',
      height: '50px'
    };
    var stops = [
      { offset: 0.0, color: '#f00', opacity: 1.0 },
      { offset: 0.5, color: '#fff', opacity: 1.0 },
      { offset: 1.0, color: '#0f0', opacity: 1.0 }
    ];
    var onChangeCallback = function onChangeCallback(colorStops, colorMap) {
      //console.log(colorStops);
    }


    return (
      <div className={classNames(styles['card-container'], [styles['card-container-show']])}>
        <Tabs type="card"
              tabBarExtraContent={<div
                onClick={this.handleClickShow()}>Hide</div>}>
          <TabPane tab="Raster" key="1">
            <div>
              <Tabs type="card">
                <TabPane tab="Render" key="1">
                  <Tabs tabPosition="left">
                    <TabPane tab="Choose Colorbar" key="1">
                      <div style={{marginTop:"20px",marginBottom:"20px"}}>
                        <Col>
                          <Row span={6}>
                            <TreeSelect
                              showSearch
                              style={{ width: 300 }}
                              value={this.state.selectValue}
                              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                              placeholder="Please select"
                              allowClear
                              treeDefaultExpandAll
                              onChange={this.selectOnChange}>
                              <TreeNode value="default" title="Default" key="0-1">
                                {ddd?
                                  ddd.map((item) => this.renderZDY(item)):null
                                }
                              </TreeNode>
                              <TreeNode value="xtnz" title="xtnz" key="0-2">
                                {xtnz.map((item) => this.renderXTNZ(item))}
                              </TreeNode>
                            </TreeSelect>

                          </Row>

                          <Row gutter={32}>
                            <div style={{top:"10px", position:"relative"}}>
                              <button
                                onClick={this.handleClick}>{this.state.displayColorPicker ? 'Hide' : 'Create ColorBar'}</button>
                              {this.state.displayColorPicker ?
                                <div style={{width:"300px", height:"200px", top:"20px",bottom:"20px",position:"relative" }}>
                                  <div style={{top:"10px",position:"relative"}}>
                                    <Radio.Group onChange={this.typeOnChange}>
                                      <Radio value={'continuous'}>Continuous</Radio>
                                      <Radio value={'descrete'}>Descrete</Radio>
                                    </Radio.Group>
                                  </div>
                                  <div style={{top:"20px",right:"5px", left:"5px", position:"relative"}}>
                                    <ReactGradientColorPicker
                                      type1={this.state.type2}
                                      stops={stops}
                                      onChange={this.colorOnChange}
                                    />
                                  </div>
                                  <div style={{top:"50px",position:"relative"}}>
                                    <Input placeholder={'Input the name'} onChange={this.nameOnChange}>
                                    </Input>
                                  </div>
                                  <div style={{top:"70px", marginBottom:"60px", position:"relative"}}>
                                    <button onClick={()=>this.submitColorbarOnClick()}>Submit Your Colormap</button>
                                  </div>
                                </div> : null}
                            </div>
                          </Row>
                        </Col>
                      </div>
                    </TabPane>
                    <TabPane tab="Band Combination" key="2">
                      jjjjjjjjjjj
                    </TabPane>
                  </Tabs>
                </TabPane>
                <TabPane tab="Process" key="2">
                  <div style={{marginLeft:"20px", marginTop:"20px",marginBottom:"20px"}}>
                    <Row>
                      <Col>Gamma:</Col>
                      <Col span={12}>
                        <Slider
                          min={0.8}
                          max={2.4}
                          onChange={this.GammaOnChange}
                          value={typeof inputValueGamma === 'number' ? inputValueGamma : 0.8}
                          step={0.01}
                        />
                      </Col>
                      <Col span={4}>
                        <InputNumber
                          min={0.8}
                          max={2.4}
                          style={{ marginLeft: 16 }}
                          value={inputValueGamma}
                          onChange={this.GammaOnChange}
                          step={0.01}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        Saturation:
                      </Col>
                      <Col span={12}>
                        <Slider
                          min={0}
                          max={2}
                          onChange={this.SaturationOnChange}
                          value={typeof inputValueSaturation === 'number' ? inputValueSaturation : 0}
                          step={0.01}
                        />
                      </Col>
                      <Col span={4}>
                        <InputNumber
                          min={0}
                          max={2}
                          style={{ marginLeft: 16 }}
                          step={0.01}
                          value={inputValueSaturation}
                          onChange={this.SaturationOnChange}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col>Contrast:</Col>
                      <Col span={12}>
                        <Slider
                          min={0}
                          max={30}
                          onChange={this.ContrastOnChange}
                          value={typeof inputValueContrast === 'number' ? inputValueContrast : 0}
                          step={0.01}
                        />
                      </Col>
                      <Col span={4}>
                        <InputNumber
                          min={0}
                          max={30}
                          style={{ marginLeft: 16 }}
                          step={1}
                          value={inputValueContrast}
                          onChange={this.ContrastOnChange}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col>Bias:</Col>
                      <Col span={12}>
                        <Slider
                          min={0}
                          max={1}
                          onChange={this.BiasOnChange}
                          value={typeof inputValueBias === 'number' ? inputValueBias : 0}
                          step={0.01}
                        />
                      </Col>
                      <Col span={4}>
                        <InputNumber
                          min={0}
                          max={1}
                          style={{ marginLeft: 16 }}
                          step={0.01}
                          value={inputValueBias}
                          onChange={this.BiasOnChange}
                        />
                      </Col>
                    </Row>
                  </div>
                </TabPane>
                <TabPane tab="Calculate" key="3">
                  Calculate
                  <Row>
                    {/*<Col span={16}>*/}
                    {/*  <Input*/}
                    {/*    defaultValue={"Please input a formula"}*/}
                    {/*    onChange={this.formulaOnChange}>*/}
                    {/*    value={inputFormula}*/}
                    {/*  </Input>*/}
                    {/*</Col>*/}
                  </Row>
                </TabPane>
              </Tabs>
            </div>
          </TabPane>
          <TabPane tab="Vector" key="2">
            <div style={{ height: "100px" }}>
              <div style={style}>
                <ReactGradientColorPicker
                  onChange={this.colorOnChange()}
                  stops={stops}
                />
              </div>
            </div>
          </TabPane>
        </Tabs></div>
    );
  }
}

export default Colormap;
