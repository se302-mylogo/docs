import React, {FC, useEffect, useState} from 'react';

import {connect, Dispatch, FormattedMessage} from 'umi';
import {GridContent} from '@ant-design/pro-layout';
import {Menu} from 'antd';
import BaseView from './components/base';
import BindingView from './components/binding';
import {CurrentUser} from './data.d';
import NotificationView from './components/notification';
import SecurityView from './components/security';
import styles from './style.less';

const {Item} = Menu;

interface AccountSettingsProps {
  dispatch: Dispatch;
  currentUser: CurrentUser;
}

type AccountSettingsStateKeys = 'base' | 'security' | 'binding' | 'notification';

interface AccountSettingsState {
  mode: 'inline' | 'horizontal';
  menuMap: {
    [key: string]: React.ReactNode;
  };
  selectKey: AccountSettingsStateKeys;
}

const menuMap = {
  base: <FormattedMessage id="accountsettings.menuMap.basic" defaultMessage="Basic Settings"/>,
  security: (
    <FormattedMessage id="accountsettings.menuMap.security" defaultMessage="Security Settings"/>
  ),
  binding: (
    <FormattedMessage id="accountsettings.menuMap.binding" defaultMessage="Account Binding"/>
  ),
  notification: (
    <FormattedMessage
      id="accountsettings.menuMap.notification"
      defaultMessage="New Message Notification"
    />
  ),
};

// @ts-ignore
const AccountSettings: FC<AccountSettingsProps> = (props) => {
  const {dispatch, currentUser} = props;
  const [state, setState] = useState<AccountSettingsState>({
    mode: 'inline',
    menuMap,
    selectKey: 'base',
  })

  useEffect(() => {
    dispatch({
      type: 'accountSettings/fetchCurrent',
    });
  }, [1])

  const getMenu = () => {
    return Object.keys(state.menuMap).map((item) => <Item key={item}>{state.menuMap[item]}</Item>);
  };

  const getRightTitle = () => {
    return menuMap[state.selectKey];
  };

  const selectKey = (key: AccountSettingsStateKeys) => {
    setState({
      ...state,
      selectKey: key,
    });
  };

  const renderChildren = () => {
    switch (state.selectKey) {
      case 'base':
        return <BaseView/>;
      case 'security':
        return <SecurityView/>;
      case 'binding':
        return <BindingView/>;
      case 'notification':
        return <NotificationView/>;
      default:
        break;
    }

    return null;
  };

  if (!currentUser.userid) {
    return '';
  }

  return (
    <GridContent>
      <div
        className={styles.main}
      >
        <div className={styles.leftMenu}>
          <Menu
            mode={state.mode}
            selectedKeys={[state.selectKey]}
            onClick={({key}) => selectKey(key as AccountSettingsStateKeys)}
          >
            {getMenu()}
          </Menu>
        </div>
        <div className={styles.right}>
          <div className={styles.title}>{getRightTitle()}</div>
          {renderChildren()}
        </div>
      </div>
    </GridContent>
  );
}

export default connect(
  ({accountSettings}: { accountSettings: { currentUser: CurrentUser } }) => ({
    currentUser: accountSettings.currentUser,
  }),
)(AccountSettings);
