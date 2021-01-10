import {LockTwoTone, UserOutlined} from '@ant-design/icons';
import logo from '@/assets/logo.png';
import {Alert, message} from 'antd';
import React, {useState} from 'react';
import ProForm, {ProFormText} from '@ant-design/pro-form';
import {history, Link, SelectLang, useIntl} from 'umi';
import Footer from '@/components/Footer';
import {login, LoginParamsType} from '@/services/login';
import styles from './index.less';

const LoginMessage: React.FC<{
  content: string;
}> = ({content}) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);
/*
 * 此方法会跳转到 redirect 参数所在的位置
 */

const goto = () => {
  const {query} = history.location;
  const {redirect} = query as {
    redirect: string;
  };
  window.location.href = redirect || '/';
};

const Login: React.FC<{}> = () => {
  const [submitting, setSubmitting] = useState(false);
  const [userLoginState, setUserLoginState] = useState<API.LoginStateType>({});
  const intl = useIntl();

  const handleSubmit = async (values: LoginParamsType) => {
    setSubmitting(true);

    try {
      // 登录
      const msg = await login({...values});
      if (msg.status===200) {
        localStorage.setItem('access_token', msg.data.accessToken);// Set csrfToken localStorage for further requests.
        localStorage.setItem('csrf_token', msg.data.csrfToken); // Set csrfToken localStorage for further requests.
        message.success('登录成功！');
        goto();
        return;
      } // 如果失败去设置用户错误信息

      setUserLoginState(msg);
    } catch (error) {
      message.error('登录失败，请重试！');
    }

    setSubmitting(false);
  };

  const {status} = userLoginState;
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
          <div className={styles.desc}>登陆即刻开启云作业</div>
        </div>

        <div className={styles.main}>
          <ProForm
            initialValues={{
              autoLogin: true,
            }}
            submitter={{
              render: (_, dom) => dom.pop(),
              submitButtonProps: {
                loading: submitting,
                size: 'large',
                style: {
                  width: '100%',
                },
              },
            }}
            onFinish={async (values) => {
              handleSubmit(values);
            }}
          >

            {status === 404 && (
              <LoginMessage
                content={intl.formatMessage({
                  id: 'pages.login.accountLogin.errorMessage',
                  defaultMessage: '账户或密码错误（admin/ant.design)',
                })}
              />
            )}

            <>
              <ProFormText
                name="username"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className={styles.prefixIcon}/>,
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.username.placeholder',
                  defaultMessage: '用户名',
                })}
                rules={[
                  {
                    required: true,
                    message: '用户名是必填项！',
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: <LockTwoTone className={styles.prefixIcon}/>,
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.password.placeholder',
                  defaultMessage: '密码',
                })}
                rules={[
                  {
                    required: true,
                    message: '密码是必填项！',
                  },
                ]}
              />
            </>

            <div
              style={{
                marginBottom: 24,
              }}
            >
              <a
                style={{
                  float: 'right',
                }}
              >
                忘记密码 ?
              </a>
              <Link to="/user/register">
                没有账号
              </Link>
            </div>
          </ProForm>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default Login;
