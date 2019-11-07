import React, { Component } from 'react';
import { formatMessage, setLocale, getLocale, FormattedMessage } from 'umi/locale';
import styles from './index.less';
import classNames from 'classnames';
import { connect } from 'dva';
import { Scrollbars } from 'react-custom-scrollbars';
import {Tabs,Tree,Select,List,Icon,Empty,notification,Dropdown,Menu,Input,} from 'antd';
import cesiumMap from '@/components/TDMap/oc.cesium';
import loc_search from '@/assets/digitalMap/loc_search.png';
import Legend from '@/components/Legend';
import { IconFont } from '@/utils/common';
import Ellipsis from '@components/Ellipsis';
import themeData from '@/assets/timeLineContent';
import { getLayer, getDatasetByTags } from '../../service';
import LayerPlayer from '@/pages/mapView/components/layerPlayer';

const { TabPane } = Tabs;
const { Option } = Select;
const { TreeNode } = Tree;
const { Search } = Input;
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
      catalogThemeData: themeData,      //每一年份的数据集列表
      selectedYear: undefined,
      selectedTags: undefined,          //已选择的标签集
      selectedDataset: undefined,       //选择的数据集
      selectedKeys: undefined,
      currentPageDataset: 1,
      activeKey: '1',                   //面板key
      layerPlayerVisible: false,
      datasetWithLayersForPlayer: undefined,
      layerCheckedKeys: [],
    };
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'mapView/fetchTags',
    });
  }

  //切换tab
  tabOnChange = activeKey => {
    this.setState({
      activeKey: activeKey,
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

  //点击tab1 catalog tree 叶子节点跳转到tab3
  handleCatalogTreeSelect = (selectedKeys, e) => {
    const { node } = e;
    let selectedDataset = node.props.dataRef;
    this.goToThirdTab(selectedDataset);
  };

  //tab2数据集分页异步查询
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

  //tab1 ,tab2 点击数据前往图层列表,为每个数据集添加key
  goToThirdTab = (dataset) => {
    const { selectedDataset = [] } = this.state;
    if (!selectedDataset.some(item => item.id === dataset.id)) {
      dataset.key = dataset.id;
      this.setState({selectedDataset: [...selectedDataset, dataset],  });
    }
    this.setState({activeKey: '3' });
  };

  //tab2 搜索条件选择年份变化
  handleSelectYear = (value) => {
    const { selectedTags = [] } = this.state;
    this.setState({ selectedYear: [value] });
    this.props.dispatch({
      type: 'mapView/fetchDatasetByTags',
      payload: { tags: [value, ...selectedTags] },
    });
  };

  //tab2 搜索条件标签变化
  handleSelectChange = (tags) => {
    const { dispatch } = this.props;
    const { selectedYear = [] } = this.state;
    this.setState({ selectedTags: tags });
    if (tags.length > 0 || selectedYear.length > 0) {
      dispatch({
        type: 'mapView/fetchDatasetByTags',
        payload: { tags: [...selectedYear, ...tags] },
      });
    }
  };

//tab3 点击播放，传递准备播放的图层,清除已check的图层
  setLayers = (data) => {
    const saveLayers = (layers) => {
      this.setState({
        datasetWithLayersForPlayer: layers,
        layerPlayerVisible: true,
      });
    };
    if (data.datasetLayers) {
      saveLayers(data.datasetLayers);
    } else {
      let id = data.id;
      getLayer(id).then((response) => {
        if (response.success && response.data) {
          response.data.key = id;
          response.data.layers.map(((layer, index) => {
            layer.key = `${id}-${index}`;
            return layer;
          }));
          saveLayers(response.data);
        }
      });
    }
  };

  closeLayerPlayer = () => {
    this.setState({ layerPlayerVisible: false });
  };

  //todo:请求colormapId 然后渲染
  showLegend = (e, layer) => {
    e.stopPropagation();
    this.props.dispatch({
      type: 'mapView/fetchColormapIdByLayerName',
      payload: layer,
    });
  };

//渲染数据tab3节点
  renderDatalsetTreeNodes = (data) =>
    data.map(item => {
      return <TreeNode selectable={false} checkable={false}
                       key={item.key}
                       title={<div className={styles.tab3_parent_node}>
                         <Ellipsis className={styles.parent_node_ellipsis}
                                   lines={1}
                                   tooltip>{isCh ? item.nameChn || '没有数据名' : item.nameEn}
                         </Ellipsis>
                         <span>{this.MoreAction(item)}</span>
                       </div>
                       }
                       dataRef={item}>
        {item.datasetLayers && (item.datasetLayers.layers.length < 100 ? item.datasetLayers.layers.map((layer) => {
          return (
            <TreeNode selectable={false}
                      title={<span className={styles.tab3_parent_node}>
                        <Ellipsis className={styles.child_node_ellipsis}
                                  lines={1}
                                  tooltip>{!layer.layerNameChn ? layer.layerNameEn : layer.layerNameChn}
                        </Ellipsis>
                        {this.state.layerCheckedKeys.indexOf(layer.key) > -1
                        && <Icon className={styles.child_node_icon}
                                 type="bg-colors"
                                 title={formatMessage({ id: 'mapView.dataTree.legend' })}
                                 onClick={(e) => this.showLegend(e, layer)}/>}
                      </span>
                      }
                      checkable
                      key={layer.key}
                      dataRef={layer}
                      isLeaf={true}
            />
          );
        }) : <TreeNode selectable={false}
                       title={<FormattedMessage id="mapView.tree.node.title.bigData"/> }
                       key={`${item.key}-0`}
                       isLeaf={true}
                       checkable={false}/>)}
      </TreeNode>;
    });

  MoreAction = dataset => (
    <Dropdown
      overlay={
        <Menu onClick={({ key }) => this.moreAction(key, dataset)}>
          <Menu.Item key="player"><Icon
            type="play-circle"/>{formatMessage({ id: 'mapView.dataTree.more.player' })}
          </Menu.Item>
          <Menu.Item key="remove"><Icon type="delete"/>{formatMessage({ id: 'mapView.dataTree.more.remove' })}
          </Menu.Item>
        </Menu>
      }
    >
      <a href='#'>
        <Icon className={styles.parent_node_icon} type="more" title={formatMessage({ id: 'mapView.dataTree.more' })}/>
      </a>
    </Dropdown>);

  moreAction = (key, dataset) => {
    switch (key) {
      case 'remove':
        this.removeDataset(dataset);
        break;
      case 'player':
        this.setLayers(dataset);
        break;
      default:
        console.log('no select');
    }
  };

//移除图层，如果有layerPlayer也移除,同时移除已经展示的图层
  removeDataset = (dataset) => {
    let { selectedDataset, datasetWithLayersForPlayer } = this.state;
    let newSelectedDataset = selectedDataset.filter((item) => item.id !== dataset.id);
    if (datasetWithLayersForPlayer && datasetWithLayersForPlayer.key === dataset.id) {
      datasetWithLayersForPlayer = undefined;
    }
    this.setState({ selectedDataset: newSelectedDataset, datasetWithLayersForPlayer: datasetWithLayersForPlayer });
    cesium_map.removeDataset(dataset);
  };

  //异步加载tab3数据集的图层
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
          response.data.key = id;
          response.data.layers.map((layer, index) => {
            layer.key = `${parentKey}-${index}`;
            return layer;
          });
          //note:这里为存储在state里的selectedDataset添加了datasetLayers属性
          treeNode.props.dataRef.datasetLayers = response.data;
          this.setState({ ...this.state.selectedDataset });
          resolve();
        }
      });
    });
  };
  //图层复选框
  layerOnCheck = (keys, e) => {
    const { checked, node } = e;
    let layer = node.props.dataRef;
    if (checked) {
      cesium_map.addLayer(layer);
    } else {
      cesium_map.hideLayer(layer);
    }
    this.setState({ layerCheckedKeys: keys });
  };

  //图层播放，拖动滚动条
  handleLayerPlayerSliderChange = (layer) => {
    let key = layer.key;
    this.setState({ layerCheckedKeys: [key] });
  };

  componentWillUnmount() {
    this.props.dispatch({
      type: 'mapView/clearState',
    });
  };

  render() {
    const { visible, handleClose, mapView, fetchDataLoading = false } = this.props;
    const { selectedDataset = [], catalogThemeData, selectedYear, selectedTags, layerPlayerVisible, datasetWithLayersForPlayer, layerCheckedKeys } = this.state;
    const { dataSetList = {}, tagList = [], urlQuery = {}, layerColormap } = mapView;
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
      <div>
        <div className={classNames(styles['card-container'], { [styles['card-container-show']]: visible })}>
          <Tabs type="card"
                activeKey={this.state.activeKey}
                onChange={this.tabOnChange}
                tabBarExtraContent={<div className="icons-list" id="tab_close" title="Hide">
                  <IconFont type="icon-eyeoff" style={{ fontSize: 24 }} onClick={handleClose}/>
                </div>}>
            <TabPane tab={formatMessage({ id: 'mapView.tab.catalog' })} key="1">
              <Scrollbars className={styles.catalogThemeList_bar}>
                <Tree onSelect={this.handleCatalogTreeSelect}
                      loadData={this.loadCatalogTreeDataset}
                      autoExpandParent={true}
                      defaultExpandedKeys={[urlQuery.key]}
                      selectedKeys={[urlQuery.key]}>
                  {renderCatalogTree(catalogThemeData)}
                </Tree>
              </Scrollbars>
            </TabPane>
            <TabPane tab={formatMessage({ id: 'mapView.tab.search' })} key="2">
              <div className={styles.searchCard}>
                <Select
                  style={{ width: '30%' }}
                  placeholder={formatMessage({ id: 'mapView.search.year' })}
                  onChange={this.handleSelectYear}
                >
                  {[2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019].map((item) => <Option value={item} key={item}>
                    {item}
                  </Option>)}
                </Select>
                <Select
                  mode="multiple"
                  style={{ width: '70%' }}
                  placeholder={formatMessage({ id: 'mapView.search.tag' })}
                  onChange={this.handleSelectChange}
                  optionLabelProp="label"
                >
                  {tagList.map((item) => <Option value={item.tagName} label={item.tagName}>
                    {item.tagName}
                  </Option>)}
                </Select>
                <Search
                  className={styles.searchCard_search}
                  placeholder={formatMessage({ id: 'mapView.search.placeholder' })}
                  enterButton={formatMessage({ id: 'mapView.search.enterButton' })}
                  size="default"
                  onSearch={value => console.log(value)}
                />
              </div>
              <Scrollbars className={styles.datasetList_bar}>
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
                        <div className={styles.icon_box}><Icon type="eye" title={'detail'}/>
                          <div className={styles.icon_divider}/>
                          <Icon
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
              </Scrollbars>
            </TabPane>
            <TabPane tab={formatMessage({ id: 'mapView.tab.dataset' })} key="3">
              <Scrollbars className={styles.layerList_bar}>
                {selectedDataset.length > 0 &&
                <Tree checkable
                      checkedKeys={layerCheckedKeys}
                      onCheck={this.layerOnCheck}
                      loadData={this.loadLayerData}>{this.renderDatalsetTreeNodes(selectedDataset)}</Tree>}
              </Scrollbars>
            </TabPane>
          </Tabs>
        </div>
        {layerPlayerVisible && datasetWithLayersForPlayer && <LayerPlayer handleClose={this.closeLayerPlayer}
                                                                          datasetWithLayers={datasetWithLayersForPlayer}
                                                                          onSliderChange={this.handleLayerPlayerSliderChange}/>}
        {layerColormap && <Legend colorMapId={layerColormap.colormapId}/>}
      </div>
    );
  }
}

export default DataTabs;
