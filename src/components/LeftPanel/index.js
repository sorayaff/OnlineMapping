import React, {PureComponent} from 'react';
import styles from './index.less';
import classNames from 'classnames';
import ReactDOM from 'react-dom';
import {IconFont, getLocalData} from '@/utils/common';
import {
  Tabs,
  Tree,
  Card,
  DatePicker,
  Row,
  Col,
  Select,
  List,
  Typography,
  Button,
  Input,
  Icon,
  Spin,
  Checkbox,
  Modal,
  Descriptions,
  notification,
} from 'antd';

const {TabPane} = Tabs;
const { Search } = Input;
const IconText = ({type, handleClick}) => (
  <span>
    <Icon type={type} onClick={handleClick}/>
  </span>
);

const yearNodes = ['2019','2018'];

// const themeNodes = [
//   {theme:'叶绿素'},
//   {theme:'环境'},
//   {theme:'二氧化碳'},
//   {theme:'生态'},
//   {theme:'海洋'}
// ]

const themeNodes = {
  '2019':['叶绿素', '海洋'],
  '2018':['生态', '海洋'],
  'all':['生态','叶绿素','海洋']
}

// const dataNodes = [
//   {data:'叶绿素1'},
//   {data:'叶绿素2'}
// ]
const dataNodes = {
  '2019':[{name:'叶绿素',children: ['2019叶绿素1','2019叶绿素2']},
    {name:'海洋',children:['2019海洋1']}],
  '2018':[{name:'海洋',children:['2018海洋1','2018海洋2']},
    {name:'生态',children:['2018生态1','2018生态2']}],
  'all':[{name:'叶绿素',children: ['2019叶绿素1','2019叶绿素2']},
    {name:'海洋',children:['2019海洋1']},
    {name:'生态',children:['2018生态1','2018生态2']}]
}



// let cesium_operate = new cesiumMap.operate();
//新建cesium图层管理对象


class LeftPanel extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      requireDataQuery: { length: 10 },
      searchQuery:{length:10},
      searchValue:'',
      themeOfYear:themeNodes['all'],
      datas:null,
      dataOfTheme:dataNodes['all'],
    };
  }

  nodeOnSelect=(keys,event)=>{
    console.log(event.node.props.title);
    let temp = this.state.requireDataQuery;
    temp['data'] = event.node.props.title;
    if(event)
    {
      this.setState(
        {
          requireDataQuery:temp,
        }
      )
      console.log('redata', this.state.requireDataQuery)
    }
  }

  searchOnchange=value=>{
    // let temp = this.state.searchQuery;
    // console.log(value);
    // if(value){
    //   temp['keywords'] = value;
    //   this.setState({
    //     searchValue:value,
    //     searchQuery:temp,
    //   })
    //   console.log('search', this.state.searchQuery);
    // }
  }

  OnSearch=value=>{
    let temp = this.state.searchQuery;
    console.log(value);
    if(value){
      temp['keywords'] = value;
      this.setState({
        searchQuery:temp,
      })
      console.log('search', this.state.searchQuery);
    }
  }

  selectYear=(keys,event)=> {
    let temp = event.node.props.title;
    if(temp) {
      this.setState({
        themeOfYear: themeNodes[temp],
        dataOfYear: dataNodes[temp],
      })
      console.log('1',this.state.themeOfYear);
      console.log('2',this.state.dataOfTheme);
    }
  }




  render() {
    //控制Leftpanel是否显示；控制Leftpanel关闭；model层；数据列表加载状态
    const {visible, handleClose, mapView, fetchDataLoading = false} = this.props;
    const {TreeNode} = Tree;
    var searchInput = this.state.searchValue;
    var th = this.state.themeOfYear;
    var da = this.state.dataOfTheme;
    console.log(da);

    return (
      <div className={classNames(styles['card-container'], {[styles['card-container-show']]: visible})} >
        <Tabs type="card"
          // 关闭面板按钮
              tabBarExtraContent={<div className="icons-list" id="tab_close" title="Hide">
                <IconFont type="icon-eyeoff" style={{fontSize: 24}} onClick={handleClose}/>
              </div>}>
        {/*<Tabs type="card"*/}
        {/*      tabBarExtraContent={<div>Hide</div>}>*/}
          <TabPane tab="Catalog" key="1">
            <div style={{marginTop:"20px", marginLeft:"20px", backgroundColor:"#3C5880"}}>
              <div style={{float:"left"}}>
                <p style={{fontSize:"25px"}}>Year</p>
                <Tree style={{float:"left" ,display:"inline"}} onSelect={this.selectYear}>
                  {yearNodes.map((item)=> (
                    <TreeNode title={item}>{item}</TreeNode>
                  ))}
                </Tree>
              </div>

              <div style={{float:"left", marginLeft:"30px"}}>
                <p style={{fontSize:"25px"}}>Theme</p>
                <Tree style={{float:"left",display:"inline"}} onSelect={this.nodeOnSelect}>
                  {th.map((item1)=>{var ff = da.find(item2=>item2.name==item1);
                    return<TreeNode title={item1}>
                      {
                        ff.children.map((item3)=>
                        {return<TreeNode title={item3}></TreeNode>})
                      }</TreeNode>})
                  }
                </Tree>
              </div>
            </div>
          </TabPane>
          <TabPane tab="Search" key="2">
            <Card className={styles.searchCard}>
            <Search
              placeholder="input search text"
              style={{ width: 400 }} onSearch={this.OnSearch}
            />
            </Card>
          </TabPane>
          <TabPane tab="Dataset" key="3">
          </TabPane>
        </Tabs>

      </div>
    );
  }
}

export default LeftPanel;
