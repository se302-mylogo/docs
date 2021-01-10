import {Button, Form, Input, InputNumber, message, Popover, Progress, Radio, Select} from 'antd';
import React, {FC, useEffect, useState} from 'react';
import {Dispatch, formatMessage, FormattedMessage, history, Link} from 'umi';

import logo from "@/assets/logo.png";
import {SelectLang} from "@@/plugin-locale/SelectLang";
import {connect} from "@@/plugin-dva/exports";
import {StateType} from './model';
import styles from './index.less';

const FormItem = Form.Item;
const {Option} = Select;

const passwordStatusMap = {
  ok: (
    <div className={styles.success}>
      <FormattedMessage id="userandregister.strength.strong"/>
    </div>
  ),
  pass: (
    <div className={styles.warning}>
      <FormattedMessage id="userandregister.strength.medium"/>
    </div>
  ),
  poor: (
    <div className={styles.error}>
      <FormattedMessage id="userandregister.strength.short"/>
    </div>
  ),
};

const passwordProgressMap: {
  ok: 'success';
  pass: 'normal';
  poor: 'exception';
} = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
};

interface RegisterProps {
  dispatch: Dispatch;
  userAndRegister: StateType;
  submitting: boolean;
}

export interface UserRegisterParams {
  mail: string;
  password: string;
  confirm: string;
  mobile: string;
  captcha: string;
  prefix: string;
}

const Register: FC<RegisterProps> = ({
                                       submitting,
                                       dispatch,
                                       userAndRegister,
                                     }) => {
  const [visible, setvisible]: [boolean, any] = useState(false);
  const [popover, setpopover]: [boolean, any] = useState(false);
  const [role, setRole] = useState<number>(-1);
  const confirmDirty = false;

  const layout = {
    labelCol: {span: 6},
    wrapperCol: {span: 24},
  };

  let interval: number | undefined;
  const [form] = Form.useForm();
  useEffect(() => {
    if (!userAndRegister) {
      return;
    }
    const account = form.getFieldValue('mail');
    if (userAndRegister.status === 'ok') {
      message.success('注册成功！');
      history.push({
        pathname: '/user/register-result',
        state: {
          account,
        },
      });
    }
  }, [userAndRegister]);
  useEffect(
    () => () => {
      clearInterval(interval);
    },
    [],
  );

  const getPasswordStatus = () => {
    const value = form.getFieldValue('password');
    if (value && value.length > 9) {
      return 'ok';
    }
    if (value && value.length > 5) {
      return 'pass';
    }
    return 'poor';
  };
  const onFinish = (values: { [key: string]: any }) => {
    const payload = {...values, avatar: values.avatar ? values.avatar : null}
    dispatch({
      type: 'userAndRegister/submit',
      payload,
    });
  };
  const checkConfirm = (_: any, value: string) => {
    const promise = Promise;
    if (value && value !== form.getFieldValue('password')) {
      return promise.reject(formatMessage({id: 'userandregister.password.twice'}));
    }
    return promise.resolve();
  };
  const checkPassword = (_: any, value: string) => {
    const promise = Promise;
    // 没有值的情况
    if (!value) {
      setvisible(!!value);
      return promise.reject(formatMessage({id: 'userandregister.password.required'}));
    }
    // 有值的情况
    if (!visible) {
      setvisible(!!value);
    }
    setpopover(!popover);
    if (value.length < 6) {
      return promise.reject('');
    }
    if (value && confirmDirty) {
      form.validateFields(['confirm']);
    }
    return promise.resolve();
  };
  const renderPasswordProgress = () => {
    const value = form.getFieldValue('password');
    const passwordStatus = getPasswordStatus();
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

  return (
    <div className={styles.container}>
      <div className={styles.lang}>
        <SelectLang/>
      </div>
      <div className={styles.content}>
        <div className={styles.top}>
          <div className={styles.header}>
            <Link to="/">
              <img alt="logo" className={styles.logo} src={logo}/>
            </Link>
          </div>
          <div className={styles.desc}>注册即刻开启云作业</div>
        </div>
        <div className={styles.main}>
          <Form {...layout} form={form} name="UserRegister" onFinish={onFinish}>
            <FormItem
              name="username"
              label="用户名"
              rules={[
                {
                  required: true,
                  message: "请输入用户名",
                },
              ]}
            >
              <Input size="large" placeholder="用户名"/>
            </FormItem>
            <FormItem
              name="name"
              label="姓名"
              rules={[
                {
                  required: true,
                  message: "请输入姓名",
                },
              ]}
            >
              <Input size="large" placeholder="姓名"/>
            </FormItem>
            <FormItem
              name="email"
              label="邮箱"
              rules={[
                {
                  required: true,
                  message: formatMessage({id: 'userandregister.email.required'}),
                },
                {
                  type: 'email',
                  message: formatMessage({id: 'userandregister.email.wrong-format'}),
                },
              ]}
            >
              <Input size="large" placeholder={formatMessage({id: 'userandregister.email.placeholder'})}/>
            </FormItem>
            <Popover
              getPopupContainer={(node) => {
                if (node && node.parentNode) {
                  return node.parentNode as HTMLElement;
                }
                return node;
              }}
              content={
                visible && (
                  <div style={{padding: '4px 0'}}>
                    {passwordStatusMap[getPasswordStatus()]}
                    {renderPasswordProgress()}
                    <div style={{marginTop: 10}}>
                      <FormattedMessage id="userandregister.strength.msg"/>
                    </div>
                  </div>
                )
              }
              overlayStyle={{width: 240}}
              placement="right"
              visible={visible}
            >
              <FormItem
                name="password"
                label="密码"
                className={
                  form.getFieldValue('password') &&
                  form.getFieldValue('password').length > 0 &&
                  styles.password
                }
                rules={[
                  {
                    required: true,
                    validator: checkPassword,
                  },
                ]}
              >
                <Input
                  size="large"
                  type="password"
                  placeholder={formatMessage({id: 'userandregister.password.placeholder'})}
                />
              </FormItem>
            </Popover>
            <FormItem
              name="confirm"
              label="确认密码"
              rules={[
                {
                  required: true,
                  message: formatMessage({id: 'userandregister.confirm-password.required'}),
                },
                {
                  validator: checkConfirm,
                },
              ]}
            >
              <Input
                size="large"
                type="password"
                placeholder={formatMessage({id: 'userandregister.confirm-password.placeholder'})}
              />
            </FormItem>
            <FormItem
              name="gender" label="性别"
              rules={[
                {
                  required: true,
                  message: "请选择性别",
                }]}
            >
              <Radio.Group value={0}>
                <Radio value={0}>男</Radio>
                <Radio value={1}>女</Radio>
              </Radio.Group>
            </FormItem>
            <FormItem
              name="school"
              label="学校"
              rules={[
                {
                  required: true,
                  message: "请输入学校",
                }]}
            >
              <Input placeholder="学校"/>
            </FormItem>
            <FormItem
              name="role"
              label="身份"
              rules={[
                {
                  required: true,
                  message: "请选择身份",
                }]}
            >
              <Radio.Group value={role} onChange={(e) => {
                setRole(e.target.value)
              }}>
                <Radio.Button value={0}>学生</Radio.Button>
                <Radio.Button value={1}>老师</Radio.Button>
              </Radio.Group>
            </FormItem>
            {
              (role === 0) ?
                <>
                  <FormItem
                    name="age"
                    label="年龄"
                    rules={[
                      {
                        required: true,
                        message: "请选择年龄",
                      }]}
                  >
                    <InputNumber
                      min={0}
                      max={200}
                      placeholder="年龄"
                    />
                  </FormItem>
                  <FormItem
                    name="grade"
                    label="年级"
                    rules={[
                      {
                        required: true,
                        message: "请选择年级",
                      }]}
                  >
                    <Select onChange={(grade) => {
                      form.setFieldsValue({grade})
                    }
                    }>
                      <Option value="一年级">一年级</Option>
                      <Option value="二年级">二年级</Option>
                      <Option value="三年级">三年级</Option>
                      <Option value="四年级">四年级</Option>
                      <Option value="五年级">五年级</Option>
                      <Option value="六年级">六年级</Option>
                      <Option value="七年级">七年级</Option>
                      <Option value="八年级">八年级</Option>
                      <Option value="九年级">九年级</Option>
                      <Option value="高一">高一</Option>
                      <Option value="高二">高二</Option>
                      <Option value="高三">高三</Option>
                      <Option value="大一">大一</Option>
                      <Option value="大二">大二</Option>
                      <Option value="大三">大三</Option>
                      <Option value="大四">大四</Option>
                    </Select>
                  </FormItem>
                  <FormItem
                    name="className"
                    label="班级"
                    rules={[
                      {
                        required: true,
                        message: "请输入班级",
                      }]}
                  >
                    <Input placeholder="班级"/>
                  </FormItem>
                </>
                : <></>
            }
            {
              (role === 1) ?
                <>
                  <FormItem
                    name="telephone"
                    label="手机号"
                    rules={[
                      {
                        required: true,
                        message: formatMessage({id: 'userandregister.phone-number.required'}),
                      },
                      {
                        pattern: /^\d{11}$/,
                        message: formatMessage({id: 'userandregister.phone-number.wrong-format'}),
                      },
                    ]}
                  >
                    <Input
                      size="large"
                      placeholder={formatMessage({id: 'userandregister.phone-number.placeholder'})}
                    />
                  </FormItem>
                  <FormItem
                    name="title"
                    label="职称"
                    rules={[
                      {
                        required: true,
                        message: "请输入职称",
                      },
                    ]}
                  >
                    <Input size="large" placeholder="职称"/>
                  </FormItem>
                </> : <></>
            }
            <FormItem>
              <Button
                size="large"
                loading={submitting}
                className={styles.submit}
                type="primary"
                htmlType="submit"
              >
                <FormattedMessage id="userandregister.register.register"/>
              </Button>
              <Link className={styles.login} to="/user/login">
                <FormattedMessage id="userandregister.register.sign-in"/>
              </Link>
            </FormItem>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default connect(
  ({
     userAndRegister,
     loading,
   }: {
    userAndRegister: StateType;
    loading: {
      effects: {
        [key: string]: boolean;
      };
    };
  }) => ({
    userAndRegister,
    submitting: loading.effects['userAndRegister/submit'],
  }),
)(Register);
