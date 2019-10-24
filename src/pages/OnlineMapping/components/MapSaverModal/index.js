import React, { useState, useEffect } from 'react';
import { Modal, Form, Radio, Input, Row, Col } from 'antd';
import ReactMapboxGl, {
  RotationControl,
  ScaleControl,
  MapContext,
} from 'react-mapbox-gl';
import FileSaver from 'file-saver';
import html2canvas from 'html2canvas';
import styles from './index.less';
import { connect } from 'dva';
import $ from 'jquery';
import canvg from '@/pages/OnlineMapping';

const MAPBOX_TOKEN =
  'pk.eyJ1Ijoid2F0c29ueWh4IiwiYSI6ImNrMWticjRqYjJhOTczY212ZzVnejNzcnkifQ.-0kOdd5ZzjMZGlah6aNYNg'; // Set your mapbox token here
const MapboxMap = ReactMapboxGl({ accessToken: MAPBOX_TOKEN, attributionControl: false, preserveDrawingBuffer: true });


function MapSaverModal(props) {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const { visible, form, dispatch, mapPreview } = props;
  const [mapSize, setMapSize] = useState({
    height: '700px',
    width: '1000px',
  });
  const { getFieldDecorator, setFieldsValue } = form;
  const [_map, setMap] = useState(null);
  const [mapCenter,setMapCenter] = useState([0,0]);
  const [mapZoom,setMapZoom] = useState(11);

  useEffect(() => {
    if (_map) {
      _map.resize();
    }
  }, [_map, mapSize]);

  useEffect(() => {
    if(mapPreview){
      setMapCenter(mapPreview.getCenter());
      setMapZoom(mapPreview.getZoom());
    }
  }, [mapPreview]);

  const handleOk = () => {
    setConfirmLoading(true);
    form.validateFields((err, values) => {
      if (err) {
        setConfirmLoading(false);
        return;//检查Form表单填写的数据是否满足rules的要求
      }
      console.log(values);
      printImg(values.format,values.filename);
      dispatch({
        type: 'onlineMapping/setMapSaverModalVisible',
        payload: false,
      });

      setConfirmLoading(false);
    });
  };

  const handleCancel = () => {
    props.form.resetFields();//重置Form表单的内容
    props.handleCancel();
  };

  const onMapSizeChange = (e) => {
    console.log(e.target.id);
    e.target.id === 'width' ? setMapSize({
      height: mapSize.height,
      width: e.target.value + 'px',
    }) : setMapSize({ width: mapSize.width, height: e.target.value + 'px' });
  };

  const printImg = (type,filename) => {
    // HTMLCanvasElement.prototype.getContext = function(origFn) {
    //   return function(type, attribs) {
    //     attribs = attribs || {};
    //     attribs.preserveDrawingBuffer = true;
    //     return origFn.call(this, type, attribs);
    //   };
    // }(HTMLCanvasElement.prototype.getContext);
    let nodesToRecover = [];
    let nodesToRemove = [];
    $('#map-preview').find('svg').map(function(index, node) {
      let parentNode = node.parentNode;
      let svg = node.outerHTML.trim();
      let canvas = document.createElement('canvas');
      canvg(canvas, svg);
      if (node.style.position) {
        canvas.style.position += node.style.position;
        canvas.style.left += node.style.left;
        canvas.style.top += node.style.top;
      }
      nodesToRecover.push({
        parent: parentNode,
        child: node,
      });
      parentNode.removeChild(node);

      nodesToRemove.push({
        parent: parentNode,
        child: canvas,
      });
      parentNode.appendChild(canvas);
    });
    html2canvas(document.querySelector('#map-preview'), { useCORS: true })
      .then((canvas) => {
        let link = document.createElement('a');
        link.href = canvas.toDataURL('image/'+type);
        link.download = filename + '.'+type;
        link.click();
      });
  };


  return (
    <Modal
      title="出图预览"
      centered
      maskClosable={false}
      width={'90vw'}
      visible={visible}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
    >
      <Form layout="vertical">
        <Row>
          <Col span={4}>
            <Form.Item label="Width (px)" wrapperCol={{ span: 20 }}>
              {getFieldDecorator('width', {
                rules: [{ required: true, message: 'Please input the width of export map!' }],
                initialValue: '1000',
              })(<Input onChange={onMapSizeChange}/>)}
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item label="Height (px)" wrapperCol={{ span: 20 }}>
              {getFieldDecorator('height', {
                rules: [{ required: true, message: 'Please input the height of export map!' }],
                initialValue: '700',
              })(<Input onChange={onMapSizeChange}/>)}
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item label="Output format">
              {getFieldDecorator('format', {
                initialValue: 'png',
              })(
                <Radio.Group>
                  <Radio value="png">PNG</Radio>
                  <Radio value="jpg">JPG</Radio>
                </Radio.Group>,
              )}
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item label="Filename">
              {getFieldDecorator('filename',{
                rules: [{ required: true, message: 'Please input the filename of export map!' }],
              })(
                <Input />
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <div className={styles.mapPreview_container} id='map-preview'>
        {mapPreview &&
        <MapboxMap
          style={mapPreview.getStyle()}
          containerStyle={mapSize}
          center={mapCenter}
          zoom={[mapZoom]}
        >
          <MapContext.Consumer>
            {map => {
              setMap(map);
              const currentCenter = map.getCenter();
              const currentZoom = map.getZoom();
              if (currentCenter[0] !== mapCenter[0] || currentCenter[1] !== mapCenter[1]){
                setMapCenter(currentCenter);
              }
              if(currentZoom !== mapZoom){
                setMapZoom(currentZoom);
              }
            }}
          </MapContext.Consumer>
        </MapboxMap>
        }
      </div>
    </Modal>
  );
}

export default connect(({ onlineMapping }) => ({
  visible: onlineMapping.mapSaverModalVisible,
  onlineMapping,
}))(Form.create()(MapSaverModal));
