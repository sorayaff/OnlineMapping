import styles from './index.less'
import { Row } from 'antd';
import DatasetCard from '@/components/DatasetCard';
import React from 'react';

function DataSetTagList({dataSource,linkedDataset}) {
  return (
    <div className={styles.home__main__datasetTag}>
      <Row type="flex" justify="space-around" aligh="middle" gutter={{ xs: 16, sm: 16, md: 16, lg: 16 }}>
        {dataSource.map((item) => <DatasetCard cardWidth={'18%'} cardHeight={'150px'} cardData={item} key={item.id}/>)}
      </Row>
    </div>
  );
}

export default DataSetTagList;
