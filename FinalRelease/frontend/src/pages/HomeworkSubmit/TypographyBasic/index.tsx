import React from 'react';
import styles from './index.less';
import {Divider, Typography} from 'antd';

const {Title, Paragraph} = Typography;

export default () => (
  <div className={styles.container}>
    <div id="components-typography-demo-basic">
      <Typography>
        <Title>作业内容</Title>
        <Paragraph>
          he deadline of this lab is on Wednesday 12:00 AT NOON, Oct 28, 2020, and no delay is
          allowed!
        </Paragraph>
        <Paragraph>
          Afte you have passed the grade test, you need first package your code and rename the file
          lab3_xxx.tar.gz to lab3_[your student ID].tar.gz. For example, if your student ID is
          518000900000, then the file name should be lab3_518000900000.tar.gz, and no any other
          letters are included. You can use the following commands to finish this step.
        </Paragraph>
        <Divider/>
      </Typography>
    </div>
  </div>
);
