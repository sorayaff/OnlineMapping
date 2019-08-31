import classNames from 'classnames';
import styles from '@/components/Legend/index.less';
import { Row } from 'antd';
import React from 'react';

function DiscreteLegend({ colorbar }) {
  let tempColor, tempFont;
  return (
    <div className={classNames(styles['legendContainer'])}>
      {colorbar['legend'].map(item1 => {
        tempColor = colorbar['colors'].find(item2 => item2[0] === item1[0]);
        tempColor = tempColor[1];
        tempFont = item1[1];
        return (
          <Row>
            <div className={classNames(styles['rectangle'])} style={{ backgroundColor: tempColor, float: 'left' }}/>
            <div className={classNames(styles['rectangleFont'])} style={{ float: 'left' }}>{tempFont}</div>
          </Row>
        );
      })}
    </div>
  );
}

export default DiscreteLegend;
