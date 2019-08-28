import React, { Component } from 'react';
import styles from './index.less';
import classNames from 'classnames';
import { connect } from 'dva';
import { IconFont } from '@/utils/common';
import Ellipsis from '@components/Ellipsis';
import { Scrollbars } from 'react-custom-scrollbars';
import {
  Anchor,
  Tabs,
  Tree,
  Card,
  DatePicker,
  Timeline,
  Select,
  List,
  Input,
  Icon,
  Spin,
  Tag,
  Tooltip,
} from 'antd';
import { themeData } from './themeData';

const { TabPane } = Tabs;
const { Search } = Input;
const { Option } = Select;
const { link } = Anchor;
const { TreeNode } = Tree;

const IconText = ({ type, handleClick }) => (
  <span>
    <Icon type={type} onClick={handleClick}/>
  </span>
);


@connect(({ mapView, loading }) => ({
  fetchDataLoading: loading.effects['mapView/fetchDatasetByTags'],
  fetchLayerLoading: loading.effects['mapView/fetchLayer'],
  mapView,
}))
class DataTabs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedYear: null,
      selectedTags: undefined,
      searchQuery: { length: 10 },
      datas: null,
      currentPageDataset: 1,
      currentPageLayer: 1,
      activeKey: '1',
      layerList: undefined,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'mapView/fetchTags',
    });
  }

  nodeOnSelect = (keys, event) => {
    console.log(keys);
  };

  //数据集分页异步查询
  handlePaginationChange1 = (value) => {
    const { selectedYear, selectedTags } = this.state;
    this.setState({
      currentPageDataset: value,
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'mapView/fetchDataset',
      payload: {
        tags: [selectedYear, ...selectedTags],
        start: 10 * (value - 1),
        length: 10,
      },
    });
  };

  //图层列表分页异步查询
  handlePaginationChange2 = (value) => {
    let temp = this.state.searchQuery;
    this.setState({
      currentPageLayer: value,
      searchQuery: temp,
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'mapView/fetchLayer',
      payload: this.state.searchQuery,
    });
  };

  goToThirdTab = (item) => {
    let id = item.id;
    this.setState({
      activeKey: '3',
    });
    this.props.dispatch({
      type: 'mapView/fetchLayer',
      payload: id,
    });
  };

  tabOnChange = activeKey => {
    this.setState({
      activeKey: activeKey,
    });
  };

  //选择年份变化
  handleSelectYear = (value) => {
    const { selectedTags = [] } = this.state;
    this.props.dispatch({
      type: 'mapView/fetchDatasetByTags',
      payload: { tags: [value, ...selectedTags] },
    });
    this.setState({ selectedYear: value });
  };

  handleSelectChange = (tags) => {
    const { dispatch } = this.props;
    const { selectedYear } = this.state;
    this.setState({ selectedTags: tags });
    dispatch({
      type: 'mapView/fetchDatasetByTags',
      payload: { tags: [selectedYear, ...tags] },
    });
  };

  render() {
    const { visible, handleClose, mapView, fetchDataLoading = false, fetchLayerLoading = false } = this.props;
    const { dataSetList = [], layerList = [], tagList = [] } = mapView;
    const getTreenodes = data =>
      data.map(item => {
        if (item.children) {
          return (
            <TreeNode key={item.dataId || item.name} title={item.name}>
              {getTreenodes(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode key={item.key} title={item.name}/>;
      });
    return (
      <div className={classNames(styles['card-container'], { [styles['card-container-show']]: visible })}>
        <Tabs type="card"
              activeKey={this.state.activeKey}
              onChange={this.tabOnChange}
              tabBarExtraContent={<div className="icons-list" id="tab_close" title="Hide">
                <IconFont type="icon-eyeoff" style={{ fontSize: 24 }} onClick={handleClose}/>
              </div>}>
          <TabPane tab="Catalog" key="1">
            <Timeline>
              <Timeline.Item>
                <div className={styles.timeline_content}>
                  <h2>2018年报数据</h2>
                  <Tree style={{ float: 'left', display: 'inline' }} onSelect={this.nodeOnSelect}>
                    {getTreenodes(themeData['2018'])}
                  </Tree>
                </div>
              </Timeline.Item>
              <Timeline.Item>
                <div className={styles.timeline_content}>
                  <h2>2019年报数据</h2>
                  <Tree style={{ float: 'left', display: 'inline' }} onSelect={this.nodeOnSelect}>
                    {getTreenodes(themeData['2019'])}
                  </Tree>
                </div>
              </Timeline.Item>
            </Timeline>
          </TabPane>
          <TabPane tab="Search" key="2">
            <div className={styles.searchCard}>
              <h6>Search ecology data by tags:</h6>
              <Select
                style={{ width: '30%' }}
                placeholder="year"
                onChange={this.handleSelectYear}
              >
                {[2016, 2017, 2018, 2019].map((item) => <Option value={item} key={item}>
                  {item}
                </Option>)}
              </Select>
              <Select
                mode="multiple"
                style={{ width: '70%' }}
                placeholder="select tags"
                onChange={this.handleSelectChange}
                optionLabelProp="label"
              >
                {tagList.map((item) => <Option value={item.tagName} label={item.tagName}>
                  {item.tagName}
                </Option>)}
              </Select>
            </div>
            {/*<Button type="primary" icon="search" onClick={this.searchByQuery}>Search</Button>*/}
            <Scrollbars className={styles.datasetList_bar}>
              {/*首次打开默认不检索，无数据时不显示list组件，数据请求时显示加载中状态*/}
              <Spin spinning={fetchDataLoading}>
                {dataSetList.datasets && dataSetList.datasets.length > 0 ?
                  <List
                    itemLayout="vertical"
                    dataSource={dataSetList.datasets}
                    // 控制分页，每页十条数据，异步请求数据
                    pagination={{
                      size: 'small',
                      showQuickJumper: true,
                      onChange: this.handlePaginationChange1,
                      pageSize: 10,
                      total: dataSetList.totalCount,
                      current: this.state.currentPageDataset,
                    }}
                    renderItem={item => (
                      <List.Item>
                        <List.Item.Meta
                          id={item.id}
                          title={
                            <p onClick={() => this.goToThirdTab(item)}>{item.nameEn}</p>}
                          description={<Ellipsis lines={3}>{item.description}</Ellipsis>}
                        />
                      </List.Item>
                    )}
                  /> : <div className={styles.search_bg}>
                    No Data
                  </div>
                }
              </Spin>
            </Scrollbars>
          </TabPane>
          <TabPane tab="Dataset" key="3">
            {/*<Card className={styles.resultCard}>*/}
            <Scrollbars className={styles.layerList_bar}>
              <Spin spinning={fetchLayerLoading}>
                <List
                  itemLayout="vertical"
                  dataSource={layerList.layers}
                  pagination={layerList.layers && layerList.layers.length > 0 ? {
                    size: 'small',
                    showQuickJumper: true,
                    onChange: this.handlePaginationChange2,
                    pageSize: 10,
                    current: this.state.currentPageLayer,
                  } : false}
                  renderItem={item => (
                    <List.Item>
                      <List.Item.Meta
                        title={item.layerName}
                        description={<Ellipsis lines={1} tooltip>{item.dimensionValue}</Ellipsis>}
                      />
                    </List.Item>
                  )}
                />
              </Spin>
            </Scrollbars>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default DataTabs;
