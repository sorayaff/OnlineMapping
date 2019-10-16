import React, { useState, useEffect } from 'react';
import { Modal,Form,Radio,Input } from 'antd';
import { connect } from 'dva';

function MapSaverModal(props) {
  const [confirmLoading,setConfirmLoading] = useState(false);
  const {visible,form,dispatch} = props;
  const { getFieldDecorator } = form;

  const handleOk = () => {
    setConfirmLoading(true);
    form.validateFields((err, values) => {
      if (err){
        setConfirmLoading(false);
        return;//检查Form表单填写的数据是否满足rules的要求
      }
      console.log(values);
      dispatch({
        type: 'onlineMapping/setMapSaverModalVisible',
        payload: false
      });
      setConfirmLoading(false);
    });
  };

  const handleCancel = () => {
    props.form.resetFields();//重置Form表单的内容
    props.handleCancel();
  };


  return (
    <Modal
      title="出图预览"
      centered
      maskClosable={false}
      width={'80vw'}
      visible={visible}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
    >
      <Form layout="vertical">
        <Form.Item label="Width">
          {getFieldDecorator('width', {
            rules: [{ required: true, message: 'Please input the width of export map!' }],
          })(<Input />)}
        </Form.Item>
        <Form.Item label="Height">
          {getFieldDecorator('height', {
            rules: [{ required: true, message: 'Please input the height of export map!' }],
          })(<Input />)}
        </Form.Item>
        <Form.Item label="Output format" className="collection-create-form_last-form-item">
          {getFieldDecorator('format', {
            initialValue: 'png',
          })(
            <Radio.Group>
              <Radio value="png">PNG</Radio>
              <Radio value="pdf">PDF</Radio>
            </Radio.Group>,
          )}
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default connect(({ onlineMapping }) => ({
  visible:onlineMapping.mapSaverModalVisible,
  onlineMapping,
}))(Form.create()(MapSaverModal));
