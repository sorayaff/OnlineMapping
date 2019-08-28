import React, { Component } from 'react';
import { formatMessage, setLocale, getLocale, FormattedMessage } from 'umi/locale';
import styles from './index.less';
import classNames from 'classnames';
import { connect } from 'dva';
import { IconFont } from '@/utils/common';
import Ellipsis from '@components/Ellipsis';
import { Scrollbars } from 'react-custom-scrollbars';
import moment from 'moment';
import {
  Anchor,
  Tabs,
  Tree,
  Timeline,
  Select,
  List,
  Input,
  Icon,
  Spin,
  Slider,
} from 'antd';
import { themeData } from './themeData';
import { getLayer } from '../../service';
import cesiumMap from '@/components/TDMap/oc.cesium';

const { TabPane } = Tabs;
const { Search } = Input;
const { Option } = Select;
const { link } = Anchor;
const { TreeNode } = Tree;
const cesium_map = new cesiumMap.map();
const selectedLang = getLocale();

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
      selectedTags: undefined,          //已选择的标签集
      selectedDataset: undefined,       //选择的数据集
      selectedKeys: undefined,
      currentPageDataset: 1,
      activeKey: '1',                   //面板key
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
  //点击数据前往图层列表
  goToThirdTab = (dataset) => {
    const { selectedDataset = [] } = this.state;
    if (!selectedDataset.some(item => item.key === dataset.key)) {
      this.setState({
        activeKey: '3',
        selectedDataset: [...selectedDataset, dataset],
      });
    } else {
      this.setState({
        activeKey: '3',
      });
    }
  };

  tabOnChange = activeKey => {
    this.setState({
      activeKey: activeKey,
    });
  };

  //搜索条件选择年份变化
  handleSelectYear = (value) => {
    const { selectedTags = [] } = this.state;
    this.props.dispatch({
      type: 'mapView/fetchDatasetByTags',
      payload: { tags: [value, ...selectedTags] },
    });
    this.setState({ selectedYear: value });
  };
  //搜索条件标签变化
  handleSelectChange = (tags) => {
    const { dispatch } = this.props;
    const { selectedYear } = this.state;
    this.setState({ selectedTags: tags });
    dispatch({
      type: 'mapView/fetchDatasetByTags',
      payload: { tags: [selectedYear, ...tags] },
    });
  };

  renderTimeSlider = (style, layerList) => {
    let type = layerList.layerDimension.type;
    let layers = layerList.layers;
    let length = layers.length;
    if (type.toLowerCase() === 'timestamp' && length > 1) {
      let minTime = layers[0].dimensionValue;
      let maxTime = layers[length - 1].dimensionValue;
      let t2 = moment(maxTime).valueOf();
      let t1 = moment(minTime).valueOf();
      return <div style={style}>
        <Slider min={t1} max={t2} tipFormatter={(value) => moment(value).format('YYYY-MM-DD HH:mm:ss')}/>
      </div>;
    }
  };

  renderDatalsetTreeNodes = (data) =>
    data.map(item => {
      return <TreeNode checkable={false}
                       key={item.key}
                       title={<div><Ellipsis length={10}
                                             tooltip>{selectedLang === 'zh-CN' ? item.nameChn || '无名' : item.nameEn}</Ellipsis>
                       </div>}
                       dataRef={item}>
        {item.children && item.children.map((layer) => {
          return (
            <TreeNode title={layer.layerName}
                      checkable
                      key={layer.key}
                      dataRef={layer}
                      isLeaf={true}
                      selectable={false}
                      checkable={true}/>
          );
        })}
      </TreeNode>;
    });

  loadLayerData = treeNode => {
    const { dispatch } = this.props;
    let that = this;
    return new Promise(resolve => {
      if (treeNode.props.children) {
        resolve();
        return;
      }
      let id = treeNode.props.dataRef.id;
      let parentKey = treeNode.props.eventKey;
      getLayer(id).then((response) => {
        if (response.success && response.data.layers) {
          let layers = response.data.layers.map((layer, index) => {
            layer.key = `${parentKey}-${index}`;
            return layer;
          });
          treeNode.props.dataRef.children = layers;
          this.setState({ ...this.state.selectedDataset });
          resolve();
        }
      });
    });
  };

  datasetOnCheck = (keys) => {
    const { selectedDataset, selectedKeys = [] } = this.state;
    let keysLen = keys.length;
    let selectedKeysLen = selectedKeys.length;
    let addKey, keyArr, removeKey;
    if (keysLen > selectedKeysLen) {
      addKey = keys[keysLen - 1];
      keyArr = addKey.split('-');
      if (keyArr.length === 2) {
        let datasetNodeKey = keyArr[0];
        let layerNodeKey = keyArr[1];
        let layer = selectedDataset[datasetNodeKey].children[layerNodeKey];
        cesium_map.addLayer(layer);
      }
    } else if (keysLen < selectedKeysLen) {
      removeKey = selectedKeys[selectedKeysLen - 1];
      keyArr = removeKey.split('-');
      if (keyArr.length === 2) {
        let datasetNodeKey = keyArr[0];
        let layerNodeKey = keyArr[1];
        let layer = selectedDataset[datasetNodeKey].children[layerNodeKey];
        cesium_map.removeLayer(layer);
      }
    }
    this.setState({ selectedKeys: keys });
  };

  render() {
    const { visible, handleClose, mapView, fetchDataLoading = false, fetchLayerLoading = false } = this.props;
    const { selectedDataset = [] } = this.state;
    const { dataSetList = {}, layerList = {}, tagList = [] } = mapView;
    const style = {
      float: 'left',
      width: '100%',
    };
    const getCatalogTreenodes = data =>
      data.map(item => {
        if (item.children) {
          return (
            <TreeNode kty={item.dataId || item.name} title={item.name}>
              {getCatalogTreenodes(item.children)}
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
                    {getCatalogTreenodes(themeData['2018'])}
                  </Tree>
                </div>
              </Timeline.Item>
              <Timeline.Item>
                <div className={styles.timeline_content}>
                  <h2>2019年报数据</h2>
                  <Tree style={{ float: 'left', display: 'inline' }} onSelect={this.nodeOnSelect}>
                    {getCatalogTreenodes(themeData['2019'])}
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
                            <p
                              onClick={() => this.goToThirdTab(item)}>{selectedLang === 'zh-CN' ? item.nameChn || '无名' : item.nameEn}</p>}
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
              {/*{layerList && this.renderTimeSlider(style, layerList)}*/}
              {selectedDataset.length > 0 &&
              <Tree checkable onCheck={this.datasetOnCheck}
                    loadData={this.loadLayerData}>{this.renderDatalsetTreeNodes(selectedDataset)}</Tree>}
            </Scrollbars>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default DataTabs;
