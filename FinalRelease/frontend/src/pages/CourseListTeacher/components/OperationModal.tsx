import React, {FC, useEffect, useState} from 'react';
import moment from 'moment';
import {Button, Card, Col, DatePicker, Form, Input, InputNumber, Modal, Result, Row, Upload} from 'antd';
import TableForm from "@/pages/CourseRelease/components/TableForm";
import {UploadProps} from "antd/es/upload";
import {UploadChangeParam} from "antd/lib/upload";
import {LoadingOutlined, PlusOutlined} from "@ant-design/icons/lib";
import styles from '../style.less';

interface OperationModalProps {
  done: boolean;
  visible: boolean;
  current: Partial<CourseOut> | undefined;
  onDone: () => void;
  onSubmit: (values: CourseIn) => void;
  onCancel: () => void;
}

const fieldLabels = {
  name: '课程名称',
  points: '学分',
  startDate: '生效日期',
  endDate: '结束日期',
  cover: '课程封面',
  description: '课程简介',
  references: '课程教材',
};

const uploadProps: UploadProps = {
  name: 'upfile',
  multiple: false,
  action: 'https://api.fourstring.dev/medias',
  method: 'POST',
  listType: "picture-card",
  className: "avatar-uploader",
  showUploadList: false,
};

const {TextArea} = Input;

const OperationModal: FC<OperationModalProps> = (props) => {
  const [form] = Form.useForm();
  const {done, visible, current, onDone, onCancel, onSubmit} = props;
  const [loading, setLoading] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    setImageUrl(current?.cover ? current.cover.url : null)
    if (form && !visible) {
      form.resetFields();
    }
  }, [props.visible]);

  if (current) {
    form.setFieldsValue({
      ...current,
      createdAt: current.createAt ? moment(current.createAt) : null,
      updatedAt: current.updateAt ? moment(current.createAt) : null,
      startDate: current.createAt ? moment(current.createAt) : null,
      endDate: current.createAt ? moment(current.createAt) : null,
    });
  }

  const handleSubmit = () => {
    if (!form) return;
    form.submit();
  };

  const handleFinish = (values: { [key: string]: any }) => {
    if (onSubmit) {
      onSubmit(values as CourseIn);
    }
  };

  const modalFooter = done
    ? {footer: null, onCancel: onDone}
    : {okText: '保存', onOk: handleSubmit, onCancel};

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined/> : <PlusOutlined/>}
      <div style={{marginTop: 8}}>封面</div>
    </div>
  );

  const getModalContent = () => {
    if (done) {
      return (
        <Result
          status="success"
          title="操作成功"
          subTitle={`课程信息已${current ? '修改' : '创建'}成功`}
          extra={
            <Button type="primary" onClick={onDone}>
              知道了
            </Button>
          }
          className={styles.formResult}
        />
      );
    }
    return (
      <Form
        form={form}
        onFinish={handleFinish}
      >
        <Card bordered={false}>
          <Row gutter={16}>
            <Col flex={16}>
              <Row gutter={16}>
                <Col lg={8} md={12} sm={24}>
                  <Form.Item
                    label={fieldLabels.name}
                    name="name"
                    rules={[{required: true, message: '请输入课程名称'}]}
                  >
                    <Input placeholder="请输入课程名称"/>
                  </Form.Item>
                </Col>
                <Col xl={{span: 8, offset: 2}} lg={{span: 8}} md={{span: 12}} sm={24}>
                  <Form.Item
                    label={fieldLabels.points}
                    name="points"
                    rules={[{required: true, message: '请输入课程学分'}]}
                  >
                    <InputNumber min={0.5} max={20} style={{width: '100%'}}/>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col lg={8} md={12} sm={24}>
                  <Form.Item
                    label={fieldLabels.startDate}
                    name="startDate"
                    rules={[{required: true, message: '请选择开始时间'}]}
                  >
                    <DatePicker showTime style={{width: '100%'}}/>
                  </Form.Item>
                </Col>
                <Col xl={{span: 8, offset: 2}} lg={{span: 8}} md={{span: 12}} sm={24}>
                  <Form.Item
                    label={fieldLabels.endDate}
                    name="endDate"
                    rules={[{required: true, message: '请选择结束时间'}]}
                  >
                    <DatePicker showTime style={{width: '100%'}}/>
                  </Form.Item>
                </Col>
                <Col xl={{span: 8, offset: 2}} lg={{span: 10}} md={{span: 24}} sm={24}/>
              </Row>
            </Col>
            <Col flex={2}>
              <Form.Item
                label={fieldLabels.cover}
                name="cover"
                rules={[{required: true, message: '请上传课程封面'}]}
              >
                <Upload
                  onChange={({file}: UploadChangeParam) => {
                    if (file.status === 'uploading') {
                      setLoading(true);
                      return;
                    }
                    if (file.status === 'done') {
                      const cover = file.response.data;
                      form.setFieldsValue({'cover': cover});
                      setLoading(false);
                      setImageUrl(cover.url);
                    }
                  }}
                  {...uploadProps}
                >
                  {imageUrl ?
                    <img
                      src={imageUrl}
                      alt="avatar"
                      style={{width: '100%'}}
                    /> :
                    uploadButton
                  }
                </Upload>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label={fieldLabels.description}
                name="description"
                rules={[{required: true, message: '请输入课程简介'}]}
              >
                <TextArea rows={6} style={{width: '100%'}}/>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label={fieldLabels.references}
                name="books"
                rules={[{required: true, message: '请输入所需教材'}]}
              >
                <TextArea rows={2} style={{width: '100%'}}/>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="members">
            <TableForm/>
          </Form.Item>
        </Card>
      </Form>
    );
  };

  return (
    <Modal
      title={done ? null : `课程${current ? '编辑' : '添加'}`}
      className={styles.standardListForm}
      width={1200}
      bodyStyle={done ? {padding: '72px 0'} : {padding: '28px 0 0'}}
      destroyOnClose
      visible={visible}
      {...modalFooter}
    >
      {getModalContent()}
    </Modal>
  );
};

export default OperationModal;
