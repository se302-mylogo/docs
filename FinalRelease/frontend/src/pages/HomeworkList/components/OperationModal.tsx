import React, {FC, useEffect} from 'react';
import moment from 'moment';
import {Button, Card, Col, DatePicker, Form, Input, InputNumber, Modal, Result, Row, Select, Upload} from 'antd';
import {UploadOutlined} from "@ant-design/icons/lib";
import {transMedia} from "@/utils/utils";
import styles from '../style.less';

const {Option} = Select;

const fieldLabels = {
  name: '作业名称',
  availableSince: '起始时间',
  deadline: '截止时间',
  lesson: '课程名称',
  range: '日期',
  status: '作业状态',
  score: '作业分数',
  description: '作业描述',
  attachment: '附件',
};

interface OperationModalProps {
  done: boolean;
  visible: boolean;
  current: Partial<HomeworkOut> | undefined;
  onDone: () => void;
  onSubmit: (values: HomeworkIn) => void;
  onCancel: () => void;
}

const {TextArea} = Input;

const OperationModal: FC<OperationModalProps> = (props) => {
  const [form] = Form.useForm();
  const {done, visible, current, onDone, onCancel, onSubmit} = props;

  useEffect(() => {
    if (form && !visible) {
      form.resetFields();
    }
  }, [props.visible]);

  if (current) {
    form.setFieldsValue({
      ...current,
      availableSince: current.availableSince ? moment(current.availableSince) : null,
      deadline: current.deadline ? moment(current.deadline) : null,
    });
  }

  const handleSubmit = () => {
    if (!form) return;
    form.submit();
  };

  const handleFinish = (values: { [key: string]: any }) => {
    if (onSubmit) {
      onSubmit(values as HomeworkIn);
    }
  };

  const modalFooter = done
    ? {footer: null, onCancel: onDone}
    : {okText: '提交', onOk: handleSubmit, onCancel};

  const getModalContent = () => {
    if (done) {
      return (
        <Result
          status="success"
          title="操作成功"
          subTitle={`作业已${current ? '修改' : '创建'}成功`}
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
      <Form form={form} onFinish={handleFinish}>
        <Card bordered={false}>
          <Row gutter={16}>
            <Col lg={10} md={12} sm={24}>
              <Form.Item
                label={fieldLabels.name}
                name="name"
                rules={[{required: true, message: '请输入作业名称'}]}
              >
                <Input placeholder="请输入作业名称"/>
              </Form.Item>
            </Col>
            <Col xl={{span: 10, offset: 2}} lg={6} md={12} sm={24}>
              <Form.Item
                label={fieldLabels.score}
                name="totalScore"
                rules={[{required: true, message: '请输入作业分数'}]}
              >
                <InputNumber
                  min={0}
                  max={100}
                  defaultValue={current?.totalScore}
                  style={{width: '100%'}}
                  onChange={(totalScore) => form.setFieldsValue({totalScore})}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xl={{span: 10}} lg={{span: 10}} md={{span: 24}} sm={24}>
              <Form.Item
                label={fieldLabels.availableSince}
                name="availableSince"
                rules={[{required: true, message: '请选择开始时间'}]}
              >
                <DatePicker
                  showTime
                  placeholder="请选择"
                  format="YYYY-MM-DD HH:mm:ss"
                  style={{width: '100%'}}
                />
              </Form.Item>
            </Col>
            <Col xl={{span: 10, offset: 2}} lg={{span: 10}} md={{span: 24}} sm={24}>
              <Form.Item
                label={fieldLabels.deadline}
                name="deadline"
                rules={[{required: true, message: '请选择结束时间'}]}
              >
                <DatePicker
                  showTime
                  placeholder="请选择"
                  format="YYYY-MM-DD HH:mm:ss"
                  style={{width: '100%'}}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col xl={{span: 10}} lg={{span: 10}} md={{span: 24}} sm={24}>
              <Form.Item
                label={fieldLabels.status}
                name="status"
                rules={[{required: true, message: '请选择作业状态'}]}
              >
                <Select placeholder="请选择作业状态">
                  <Option value={0}>作业已锁定</Option>
                  <Option value={1}>作业开放提交</Option>
                  <Option value={2}>作业已截止</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label={fieldLabels.description}
                name="description"
                rules={[{required: true, message: '请输入作业描述'}]}
              >
                <TextArea rows={4} style={{width: '100%'}}/>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label={fieldLabels.attachment}
                name="attachments"
                rules={[{required: true}]}
              >
                <Upload
                  defaultFileList={current?.attachments?.map(media => transMedia(media))}
                  className="upload-list-inline"
                >
                  <Button icon={<UploadOutlined/>}>上传</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
        </Card>
      </Form>
    );
  };

  return (
    <Modal
      title={done ? null : `${current ? '编辑' : '添加'}作业`}
      className={styles.standardListForm}
      width={800}
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
