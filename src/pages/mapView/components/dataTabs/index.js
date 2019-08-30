import React, { Component } from 'react';
import { formatMessage, setLocale, getLocale, FormattedMessage } from 'umi/locale';
import styles from './index.less';
import classNames from 'classnames';
import { connect } from 'dva';
import { Scrollbars } from 'react-custom-scrollbars';
import {
  Tabs,
  Tree,
  Select,
  List,
  Icon,
  Empty, notification,
} from 'antd';
import cesiumMap from '@/components/TDMap/oc.cesium';
import loc_search from '@/assets/digitalMap/loc_search.png';
import { IconFont } from '@/utils/common';
import Ellipsis from '@components/Ellipsis';
import themeData from '@/assets/timeLineContent';
import { getLayer, getDatasetByTags } from '../../service';

const { TabPane } = Tabs;
const { Option } = Select;
const { TreeNode } = Tree;
const cesium_map = new cesiumMap.map();
const isCh = getLocale() === 'zh-CN';

@connect(({ mapView, loading }) => ({
  fetchDataLoading: loading.effects['mapView/fetchDatasetByTags'],
  fetchLayerLoading: loading.effects['mapView/fetchLayer'],
  mapView,
}))
class DataTabs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      catalogThemeData: themeData,
      selectedYear: undefined,
      selectedTags: undefined,          //已选择的标签集
      selectedDataset: undefined,       //选择的数据集
      selectedKeys: undefined,
      currentPageDataset: 1,
      activeKey: '1',                   //面板key
    };
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'mapView/fetchTags',
    });
  }

  //点击catalog叶子节点跳转到tab3
  handleCatalogTreeSelect = (selectedKeys, e) => {
    const { node } = e;
    let selectedDataset = node.props.dataRef;
    this.goToThirdTab(selectedDataset);
  };

  //数据集分页异步查询
  handlePaginationChange1 = (value) => {
    const { selectedYear = [], selectedTags = [] } = this.state;
    this.setState({
      currentPageDataset: value,
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'mapView/fetchDatasetByTags',
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
    if (!selectedDataset.some(item => item.id === dataset.id)) {
      dataset.key = selectedDataset.length;
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
    this.setState({ selectedYear: [value] });
  };

  //搜索条件标签变化
  handleSelectChange = (tags) => {
    const { dispatch } = this.props;
    const { selectedYear = [] } = this.state;
    this.setState({ selectedTags: tags });
    dispatch({
      type: 'mapView/fetchDatasetByTags',
      payload: { tags: [...selectedYear, ...tags] },
    });
  };

//点击播放，传递准备播放的图层,清除已check的图层
  setLayers = (data) => {
    let layers = [];
    const { dispatch } = this.props;

    function saveLayers(layers) {
      dispatch({
        type: 'mapView/saveLayersForPlay',
        payload: layers,
      });
      dispatch({
        type: 'mapView/showLayerPlayer',
      });
    }

    if (data.children) {
      layers = data.children;
      saveLayers(layers);
    } else {
      let id = data.id;
      getLayer(id).then((response) => {
        if (response.success && response.data) {
          layers = response.data;
          saveLayers(layers);
        }
      });
    }
  };

//渲染数据tab3节点
  renderDatalsetTreeNodes = (data) =>
    data.map(item => {
      return <TreeNode selectable={false} checkable={false}
                       key={item.key}
                       title={<div className={styles.parent_node}>
                         <Ellipsis className={styles.parent_node_ellipsis}
                                   lines={1}
                                   tooltip>{isCh ? item.nameChn || '没有数据名' : item.nameEn}
                         </Ellipsis>
                         <Icon className={styles.parent_node_icon} title={'数据时间轴'} type="play-circle"
                               onClick={() => this.setLayers(item)}/>
                       </div>
                       }
                       dataRef={item}>
        {item.datasetLayers && item.datasetLayers.layers.map((layer) => {
          return (
            <TreeNode selectable={false}
                      title={<div className={styles.layer_name_box}>
                        <Ellipsis lines={1}
                                  tooltip>{layer.layerName}
                        </Ellipsis></div>}
                      checkable
                      key={layer.key}
                      dataRef={layer}
                      isLeaf={true}
            />
          );
        })}
      </TreeNode>;
    });

  //tab3异步加载数据集的图层
  loadLayerData = treeNode => {
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
          treeNode.props.dataRef.datasetLayers = response.data;
          this.setState({ ...this.state.selectedDataset });
          resolve();
        }
      });
    });
  };

  //异步加载tab1数据集
  loadCatalogTreeDataset = treeNode => new Promise((resolve, reject) => {
    let parentKey = treeNode.props.eventKey;
    let tags = treeNode.props.tags;
    if (tags) {
      let query = {
        tags: tags,
        algebra: 'and',
      };
      getDatasetByTags(query).then((response) => {
          if (response.success && response.data.datasets.length > 0) {
            treeNode.props.dataRef.children = response.data.datasets.map((layer, index) => {
              layer.key = `${parentKey}-${index}`;
              return layer;
            });
            this.setState({ ...this.state.catalogThemeData });
            resolve();
          } else {
            notification.info({
              message: formatMessage({ id: 'mapView.load.catalog.nodata' }),
            });
            resolve();
          }
        },
      );
    } else resolve();
  });

  //图层复选框
  datasetOnCheck = (keys, e) => {
    const { checked, node } = e;
    let layer = node.props.dataRef;
    if (checked) {
      cesium_map.addLayer(layer);
    } else {
      cesium_map.removeLayer(layer);
    }
  };

  render() {
    const { visible, handleClose, mapView, fetchDataLoading = false } = this.props;
    const { selectedDataset = [], catalogThemeData, selectedYear, selectedTags } = this.state;
    const { dataSetList = {}, tagList = [], urlQuery = {} } = mapView;
    const renderCatalogTree = (data) => {
      return data.map(item => {
        if (item.themeList) {
          return (
            <TreeNode key={item.key} title={isCh ? item.title_ch : item.title_en} selectable={false}>
              {renderCatalogTree(item.themeList)}
            </TreeNode>
          );
        } else if (item.children) {
          return (
            <TreeNode key={item.key}
                      selectable={false}
                      tags={item.tags}
                      title={isCh ? item.title_ch : item.title_en}
                      dataRef={item}>
              {item.children.map((dataset => <TreeNode key={dataset.key}
                                                       isLeaf={true}
                                                       title={isCh ? dataset.nameChn || '无中文名' : dataset.nameEn}
                                                       selectable={true}
                                                       dataRef={dataset}/>))}
            </TreeNode>
          );
        } else
          return <TreeNode key={item.key}
                           selectable={false}
                           tags={item.tags}
                           title={isCh ? item.title_ch : item.title_en}
                           dataRef={item}/>;
      });
    };
    return (
      <div className={classNames(styles['card-container'], { [styles['card-container-show']]: visible })}>
        <Tabs type="card"
              activeKey={this.state.activeKey}
              onChange={this.tabOnChange}
              tabBarExtraContent={<div className="icons-list" id="tab_close" title="Hide">
                <IconFont type="icon-eyeoff" style={{ fontSize: 24 }} onClick={handleClose}/>
              </div>}>
          <TabPane tab="Catalog" key="1">
            <Scrollbars className={styles.catalogThemeList_bar}>
              <Tree onSelect={this.handleCatalogTreeSelect}
                    loadData={this.loadCatalogTreeDataset}
                    autoExpandParent={true}
                    defaultExpandedKeys={[urlQuery.key]}
                    defaultSelectedKeys={[urlQuery.key]}>
                {renderCatalogTree(catalogThemeData)}
              </Tree>
            </Scrollbars>
          </TabPane>
          <TabPane tab="Search" key="2">
            <div className={styles.searchCard}>
              <Select
                style={{ width: '30%' }}
                placeholder="year"
                onChange={this.handleSelectYear}
              >
                {[2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019].map((item) => <Option value={item} key={item}>
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
            <Scrollbars className={styles.datasetList_bar}>
              {/*<Spin spinning={fetchDataLoading}>*/}
              {dataSetList.datasets && dataSetList.datasets.length > 0 ?
                <List
                  itemLayout="vertical"
                  dataSource={dataSetList.datasets}
                  loading={fetchDataLoading}
                  pagination={{
                    size: 'small',
                    showQuickJumper: true,
                    onChange: this.handlePaginationChange1,
                    pageSize: 10,
                    total: dataSetList.totalCount,
                    current: this.state.currentPageDataset,
                  }}
                  renderItem={item => (
                    <List.Item key={item.key || item.id}>
                      <div className={styles.data_list_meta_header}>
                        <Ellipsis lines={1} tooltip onClick={() => this.goToThirdTab(item)}>
                          {isCh ? item.nameChn || '无中文名' : item.nameEn}
                        </Ellipsis>
                      </div>
                      <div className={styles.icon_box}><Icon type="eye" title={'detail'}/><Icon
                        type="cloud-download" title={'download'}/></div>
                      <div className={styles.data_list_description}>
                        <Ellipsis lines={3}
                                  style={{ color: '#D2D2D2', fontSize: '12px' }}>
                          {item.description}
                        </Ellipsis>
                      </div>
                    </List.Item>
                  )}
                /> : <div className={styles.query_empty}>{selectedYear ? <Empty/> :
                  <img className={styles.img_query} src={loc_search} alt={'please search one year'}/>}</div>
              }
              {/*</Spin>*/}
            </Scrollbars>
          </TabPane>
          <TabPane tab="Dataset" key="3">
            <Scrollbars className={styles.layerList_bar}>
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
