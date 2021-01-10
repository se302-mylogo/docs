import {message, Upload} from 'antd';
import {LoadingOutlined, PlusOutlined} from '@ant-design/icons';
import React from "react";

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
}

export default class Avatar extends React.Component {
  state = {
    loading: false,
  };

  handleChange = (info: { file: { status: string; originFileObj: any; }; }) => {
    if (info.file.status === 'uploading') {
      this.setState({loading: true});
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl =>
        this.setState({
          imageUrl,
          loading: false,
        }),
      );
    }
  };

  render() {
    // @ts-ignore
    const {loading, imageUrl} = this.state;
    const uploadButton = (
      <div>
        {loading ? <LoadingOutlined/> : <PlusOutlined/>}
        <div style={{marginTop: 8}}>封面</div>
      </div>
    );
    // @ts-ignore
    return (
      <Upload
        name="upfile"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        action="https://api.fourstring.dev/medias"
        beforeUpload={beforeUpload}
        onChange={this.handleChange}
      >
        {imageUrl ? <img src={imageUrl} alt="avatar" style={{width: '100%'}}/> : uploadButton}
      </Upload>
    );
  }
}
