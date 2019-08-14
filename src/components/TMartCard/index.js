import styles from './index.less';
import { Badge, Button, Icon } from 'antd';
import router from 'umi/router';
import querystring from 'querystring';
import React from 'react';
import Ellipsis from '@components/Ellipsis';

function TMartCard({ cardData }) {
  const { imgSrc = '', name = 'None', url = '', describe = 'None', id, count = 0,tagString='' } = cardData;
  const BadgeStyle = {
    backgroundColor: 'rgba(232, 255, 253, 0.5)',
    alignItems: 'center',
    marginLeft: '10px',
    color: '#fff',
  };
  const descriptionStyle = {
    fontFamily: 'MicrosoftYaHei-Bold',
    fontWeight: 'bold',
    color: 'rgba(255,255,255,1)',
    textShadow: '0px 1px 1px rgba(0, 0, 0, 1)',
    width: '90%',
    margin: '50px auto 0px',
    lineHeight: '20px',
    fontSize: '16px',
  };
  return <div className={styles.card} style={{ backgroundImage: `url(${imgSrc})` }}>
    <div className={styles.card_main}>
      <div className={styles.card_main__title_box}>
      <Badge count={count}
             overflowCount={999}
             style={{ ...BadgeStyle }}
             />
      </div>
    </div>
    <div className={styles.card_mask}>
      <div className={styles.mask_icon_right}>
        <Icon
          type='right'
          onClick={e =>
            router.push('/toolMart/toolSearch?' + querystring.stringify({ tag: tagString }))
          }
        />
      </div>
      <div className={styles.mask_icon_download}>
      <Icon type="download"/>
      </div>
    </div>
  </div>;
}

export default TMartCard;
