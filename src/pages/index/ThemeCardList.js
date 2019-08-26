import React from 'react'
import {Button,Menu,Dropdown,Icon} from 'antd';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { formatMessage, setLocale, getLocale, FormattedMessage } from 'umi/locale';
import Link from 'umi/link';
import router from 'umi/router';
import styles from './index.less'

function handleMenuClick(e) {
  console.log('click', e);
  // if(e.item)
}

function ThemeCard({data}) {
  const local = getLocale();
  let unabridged_ch;
  if(data.downLoadLink){
    unabridged_ch = data.downLoadLink.unabridged_ch ? data.downLoadLink.unabridged_ch : '';
  }
  const menu = local === 'en-US' ? (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="1" data-link={unabridged_ch}>
        <a href="http://localhost:8000/pdfjs-2.1.266-dist/web/viewer.html?file=/static/ldzbsczk.1bb01db0.pdf" target="_Blank">unabridged version</a>
      </Menu.Item>
      <Menu.Item key="2">abridged version</Menu.Item>
    </Menu>
  ) : (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="3">
        <a href="http://www.chinageoss.org/geoarc/2018/B/index.html" target="_Blank">全本</a>
      </Menu.Item>
      <Menu.Item key="4">简本</Menu.Item>
    </Menu>
  );
  const theme = local === 'en-US' ? data.title_en : data.title_ch;
  return (
    <div style={{padding:'5px',height:'500px',position:'relative'}}>
      <div style={{padding:'5px',fontSize:'18px',textAlign:'center'}}>
        <img src={data.imgSrc} style={{width:'100%',maxWidth:600}}/>
      </div>
      <div style={{fontSize:'18px',textAlign:'center'}}>
        <p style={{fontWeight:'bold'}}>{theme}</p>
      </div>
      <div className={styles.downloadArea}>
        <Button type="primary" icon='eye' ghost onClick={() => (router.push('/mapView'))}>
          <FormattedMessage id='index.viewOnMap'/>
        </Button>
        <Dropdown overlay={menu}>
          <Button>
            <FormattedMessage id='index.viewReport'/> <Icon type="down" />
          </Button>
        </Dropdown>
      </div>
    </div>
  );
}

function ThemeCardList({dataSource}) {
  return (
    <div>
      <Row>
        {dataSource.map((item) => <Col xs><ThemeCard data={item}/></Col>)}
      </Row>
    </div>
  );
}

export default ThemeCardList;
