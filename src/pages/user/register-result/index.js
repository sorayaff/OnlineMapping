import React from 'react';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import { Button } from 'antd';
import Link from 'umi/link';
import Result from '@/components/Result';
import styles from './index.less';

const actions = (
  <div className={styles.actions}>
    <Link to="/user/login">
      <Button size="large">
        <FormattedMessage id="app.register-result.back-login" />
      </Button>
    </Link>
  </div>
);

const Index = ({ location }) => (
  <Result
    className={styles.registerResult}
    type="success"
    title={
      <div className={styles.title}>
        You have successfully created your account!
      </div>
    }
    actions={actions}
    style={{ marginTop: 56 }}
  />
);

export default Index;
