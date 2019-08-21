import styles from './index.less'
import { Icon, List } from 'antd';
import router from 'umi/router';
import Link from 'umi/link';
import React from 'react';



function ReportPreviewList({dataSource}) {

  const IconText = ({ type, text }) => (
    <span>
    <Icon type={type} style={{ marginRight: 8 }} />
      {text}
  </span>
  );

  return (
    <div className={styles.home__main__left__news}>
      <div className={styles.home__main__left__news__header}>
        <Icon type="notification"/> &nbsp;<span>Report List</span>
        {/*<span className={styles.news__all}*/}
        {/*      onClick={() => (router.push('/news'))}>all news*/}
        {/*  <Icon type="right"/></span>*/}
      </div>
      <List
        className={styles.home__main__left__news__list}
        size="large"
        itemLayout="vertical"
        dataSource={dataSource}
        bordered
        renderItem={item => (
          <List.Item
            actions={[
              <IconText type="download" text="unabridged version" key="unabridged-en" />,
              <IconText type="download" text="全本" key="unabridged-cn" />,
              <IconText type="download" text="abridged version" key="abridged-en" />,
              <IconText type="download" text="简本" key="abridged-cn" />,
            ]}>
            <List.Item.Meta
              avatar={<img style={{ height: '80px', width: '80px' }} src={item.imgSrc} alt={item.title}/>}
              title={<span><Link to={`/news/${item.id}`}>{item.title}</Link><span
                style={{ float: 'right' }}>{item.time}</span></span>}
              description={<span>{item.description}</span>}
            />
          </List.Item>
        )}
      />
    </div>
  );
}

export default ReportPreviewList
