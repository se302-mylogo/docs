import React from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import {Card, Typography} from 'antd';

export default (): React.ReactNode => (
  <PageContainer>
    <Card>
      <Typography.Text
        strong
        style={{
          marginBottom: 12,
        }}
      >
        欢迎
      </Typography.Text>
    </Card>
  </PageContainer>
);
