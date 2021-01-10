import React from 'react';
import {Button, message, Upload} from 'antd';
import {UploadOutlined} from '@ant-design/icons';

const props = {
  name: 'upfile',
  multiple: true,
  action: '/medias',
  method: 'POST',
  onChange(info: { file: { status: string; name: any }; fileList: any }) {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};

export default () => (
  // @ts-ignore
  <Upload {...props}>
    <Button>
      <UploadOutlined/> Click to Upload
    </Button>
  </Upload>
);
