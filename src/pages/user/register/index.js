import React, {Component} from 'react';
import {connect} from 'dva';
import {formatMessage, FormattedMessage} from 'umi-plugin-react/locale';
import Link from 'umi/link';
import router from 'umi/router';
import {Form, Input, Button, Modal, Select, Row, Col, Popover, Progress, Cascader} from 'antd';
import styles from './index.less';
import {countryData, userType, industry, affiliation} from '@/assets/register/selectData'

const FormItem = Form.Item;
const {Option} = Select;
const InputGroup = Input.Group;

const passwordStatusMap = {
  ok: (
    <div className={styles.success}>
      <FormattedMessage id="validation.password.strength.strong"/>
    </div>
  ),
  pass: (
    <div className={styles.warning}>
      <FormattedMessage id="validation.password.strength.medium"/>
    </div>
  ),
  poor: (
    <div className={styles.error}>
      <FormattedMessage id="validation.password.strength.short"/>
    </div>
  ),
};

const passwordProgressMap = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
};

@connect(({register, loading}) => ({
  register,
  submitting: loading.effects['register/submit'],
}))
@Form.create()
class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      confirmDirty: false,
      visible: false,
      help: '',
      prefix: '86',
    };
  }


  componentDidUpdate() {
    const {form, register} = this.props;
    const account = form.getFieldValue('mail');
    if (register.status.toLowerCase() === 'ok') {
      router.push({
        pathname: '/user/register-result',
        state: {
          account,
        },
      });
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
    this.props.dispatch({
      type: 'register/clearStatus',
    })
  }

  onGetCaptcha = () => {
    let count = 59;
    this.setState({count});
    this.interval = setInterval(() => {
      count -= 1;
      this.setState({count});
      if (count === 0) {
        clearInterval(this.interval);
      }
    }, 1000);
    Modal.info({
      title: formatMessage({id: 'app.login.verification-code-warning'}),
    });
  };

  getPasswordStatus = () => {
    const {form} = this.props;
    const value = form.getFieldValue('password');
    let pattern = /(?=.*[\d])?(?=.*[a-zA-Z])(?=.*[\d])/;
    if (value && value.length > 7 && pattern.test(value)) {
      return 'ok';
    }
    if (value && value.length > 7) {
      return 'pass';
    }
    return 'poor';
  };

  handleSubmit = e => {
    e.preventDefault();
    const {form, dispatch} = this.props;
    form.validateFields({force: true}, (err, values) => {
      if (!err) {
        const {prefix} = this.state;
        console.log(values)
        dispatch({
          type: 'register/submit',
          payload: {
            ...values,
            affiliation: values.affiliation[0],
            country: values.country[0],
            userType: values.userType[0],
            industry: values.industry[0]
          },
        });
      }
    });
  };

  handleConfirmBlur = e => {
    const {value} = e.target;
    const {confirmDirty} = this.state;
    this.setState({confirmDirty: confirmDirty || !!value});
  };

  checkConfirm = (rule, value, callback) => {
    const {form} = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback(formatMessage({id: 'validation.password.twice'}));
    } else {
      callback();
    }
  };

  checkPassword = (rule, value, callback) => {
    const {visible, confirmDirty} = this.state;
    if (!value) {
      this.setState({
        help: formatMessage({id: 'validation.password.required'}),
        visible: !!value,
      });
      callback('error');
    } else {
      this.setState({
        help: '',
      });
      if (!visible) {
        this.setState({
          visible: !!value,
        });
      }
      if (value.length < 6) {
        callback('error');
      } else {
        const {form} = this.props;
        if (value && confirmDirty) {
          form.validateFields(['confirm'], {force: true});
        }
        callback();
      }
    }
  };
  checkUsername = (rule, value, callback) => {

    let regexpCode = /^[a-zA-Z]([-_a-zA-Z0-9]*)$/;
    if (regexpCode.test(value)) {
      callback();
    } else {
      callback('The username can only contain letters, numbers or special characters (-,) and must begin with letters.');
    }
  };


  changePrefix = value => {
    this.setState({
      prefix: value,
    });
  };

  renderPasswordProgress = () => {
    const {form} = this.props;
    const value = form.getFieldValue('password');
    const passwordStatus = this.getPasswordStatus();
    return value && value.length ? (
      <div className={styles[`progress-${passwordStatus}`]}>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          className={styles.progress}
          strokeWidth={6}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div>
    ) : null;
  };

  render() {
    const {form, submitting} = this.props;
    const {getFieldDecorator} = form;
    const {count, prefix, help, visible} = this.state;
    return (
      <div className={styles.main}>
        <h3>
          <FormattedMessage id="app.register.register.title"/>
        </h3>
        <Form onSubmit={this.handleSubmit}>
          <FormItem label="username">
            {getFieldDecorator('username', {
              rules: [
                {
                  required: true,
                  message: formatMessage({id: 'validation.username.required'}),
                },
                {
                  max: 32,
                  message: 'The length of username should be less than 32.',
                },
                {
                  min: 6,
                  message: 'The length of username should be greater than 6.',
                },
                {
                  validator: this.checkUsername,
                },
              ],
            })(
              <Input size="large" placeholder={formatMessage({id: 'form.username.placeholder'})}/>
            )}
          </FormItem>
          <FormItem label="password" help={help}>
            <Popover
              getPopupContainer={node => node.parentNode}
              content={
                <div style={{padding: '4px 0'}}>
                  {passwordStatusMap[this.getPasswordStatus()]}
                  {this.renderPasswordProgress()}
                  <div style={{marginTop: 10}}>
                    <FormattedMessage id="validation.password.strength.msg"/>
                  </div>
                </div>
              }
              overlayStyle={{width: 240}}
              placement="right"
              visible={visible}
            >
              {getFieldDecorator('password', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({id: 'validation.password.required'}),
                  },
                  {
                    validator: this.checkPassword,
                  },
                ],
              })(
                <Input
                  size="large"
                  type="password"
                  placeholder={formatMessage({id: 'form.password.placeholder'})}
                />
              )}
            </Popover>
          </FormItem>
          <FormItem label={'confirm password'}>
            {getFieldDecorator('confirmPassword', {
              rules: [
                {
                  required: true,
                  message: formatMessage({id: 'validation.confirm-password.required'}),
                },
                {
                  validator: this.checkConfirm,
                },
              ],
            })(
              <Input
                size="large"
                type="password"
                placeholder={formatMessage({id: 'form.confirm-password.placeholder'})}
              />
            )}
          </FormItem>
          <FormItem label={'firstName'}>
            {getFieldDecorator('firstName', {
              rules: [
                {
                  required: true,
                  message: formatMessage({id: 'validation.firstName.required'}),
                },
                {
                  pattern: /^[a-zA-Z\u4e00-\u9fa5\s.]{0,50}$/,
                  message: formatMessage({id: 'validation.firstName.wrong-format'}),
                },
              ],
            })(
              <Input
                size="large"
                placeholder={formatMessage({id: 'form.firstName.placeholder'})}
              />
            )}
          </FormItem>
          <FormItem label={'lastName'}>
            {getFieldDecorator('lastName', {
              rules: [
                {
                  required: true,
                  message: formatMessage({id: 'validation.lastName.required'}),
                },
                {
                  pattern: /^[a-zA-Z\u4e00-\u9fa5\s.]{0,50}$/,
                  message: formatMessage({id: 'validation.lastName.wrong-format'}),
                },
              ],
            })(
              <Input
                size="large"
                placeholder={formatMessage({id: 'form.lastName.placeholder'})}
              />
            )}
          </FormItem>
          <FormItem label={'email'}>
            {getFieldDecorator('email', {
              rules: [
                {
                  required: true,
                  message: formatMessage({id: 'validation.email.required'}),
                },
                {
                  type: 'email',
                  message: formatMessage({id: 'validation.email.wrong-format'}),
                },
              ],
            })(
              <Input size="large" placeholder={formatMessage({id: 'form.email.placeholder'})}/>
            )}
          </FormItem>
          {/*国家*/}
          <FormItem label={'country'}>
            {getFieldDecorator('country', {
              rules: [
                {
                  required: true,
                  message: formatMessage({id: 'validation.email.required'}),
                },
              ],
            })(
              <Cascader options={countryData} placeholder="Choose Your Country"/>
            )}
          </FormItem>
          {/*用户组织类型*/}
          <FormItem label={'Affiliation'}>
            {getFieldDecorator('affiliation', {
              rules: [
                {
                  required: true,
                  message: formatMessage({id: 'validation.email.required'}),
                },
              ],
            })(
              <Cascader options={affiliation} placeholder="Choose Your Affiliation"/>
            )}
          </FormItem>
          {/*用户所处组织名称 text*/}
          <FormItem label={'Organization'}>
            {getFieldDecorator('organization', {
              rules: [{required: true, message: 'Please input your organization!'}],
            })(<Input/>)}
          </FormItem>
          {/*userType表示用户类型*/}
          <FormItem label={'User Type'}>
            {getFieldDecorator('userType', {
              rules: [
                {
                  required: true,
                  message: formatMessage({id: 'validation.email.required'}),
                },
              ],
            })(
              <Cascader options={userType} placeholder="Choose User Type"/>
            )}
          </FormItem>
          {/*industry表示行业*/}
          <FormItem label={'Study Area'}>
            {getFieldDecorator('industry', {
              rules: [
                {
                  required: true,
                  message: formatMessage({id: 'validation.email.required'}),
                },
              ],
            })(
              <Cascader options={industry} placeholder="Choose Your Study Area"/>
            )}
          </FormItem>
          {/*<FormItem>*/}
          {/*<InputGroup compact>*/}
          {/*<Select*/}
          {/*size="large"*/}
          {/*value={prefix}*/}
          {/*onChange={this.changePrefix}*/}
          {/*style={{ width: '20%' }}*/}
          {/*>*/}
          {/*<Option value="86">+86</Option>*/}
          {/*<Option value="87">+87</Option>*/}
          {/*</Select>*/}
          {/*{getFieldDecorator('mobile', {*/}
          {/*rules: [*/}
          {/*{*/}
          {/*required: true,*/}
          {/*message: formatMessage({ id: 'validation.phone-number.required' }),*/}
          {/*},*/}
          {/*{*/}
          {/*pattern: /^\d{11}$/,*/}
          {/*message: formatMessage({ id: 'validation.phone-number.wrong-format' }),*/}
          {/*},*/}
          {/*],*/}
          {/*})(*/}
          {/*<Input*/}
          {/*size="large"*/}
          {/*style={{ width: '80%' }}*/}
          {/*placeholder={formatMessage({ id: 'form.phone-number.placeholder' })}*/}
          {/*/>*/}
          {/*)}*/}
          {/*</InputGroup>*/}
          {/*</FormItem>*/}
          {/*<FormItem>*/}
          {/*<Row gutter={8}>*/}
          {/*<Col span={16}>*/}
          {/*{getFieldDecorator('captcha', {*/}
          {/*rules: [*/}
          {/*{*/}
          {/*required: true,*/}
          {/*message: formatMessage({ id: 'validation.verification-code.required' }),*/}
          {/*},*/}
          {/*],*/}
          {/*})(*/}
          {/*<Input*/}
          {/*size="large"*/}
          {/*placeholder={formatMessage({ id: 'form.verification-code.placeholder' })}*/}
          {/*/>*/}
          {/*)}*/}
          {/*</Col>*/}
          {/*<Col span={8}>*/}
          {/*<Button*/}
          {/*size="large"*/}
          {/*disabled={count}*/}
          {/*className={styles.getCaptcha}*/}
          {/*onClick={this.onGetCaptcha}*/}
          {/*>*/}
          {/*{count*/}
          {/*? `${count} s`*/}
          {/*: formatMessage({ id: 'app.register.get-verification-code' })}*/}
          {/*</Button>*/}
          {/*</Col>*/}
          {/*</Row>*/}
          {/*</FormItem>*/}
          <FormItem>
            <Button
              size="large"
              loading={submitting}
              className={styles.submit}
              type="primary"
              htmlType="submit"
            >
              <FormattedMessage id="app.register.register"/>
            </Button>
            <Link className={styles.login} to="/user/login">
              <FormattedMessage id="app.register.sign-in"/>
            </Link>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default Register;
