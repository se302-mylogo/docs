import {CloseCircleOutlined} from '@ant-design/icons';
import {Button, Card, Col, DatePicker, Form, Input, InputNumber, Popover, Row, Select} from 'antd';
import React, {FC, useState} from 'react';
import {FooterToolbar, PageContainer} from '@ant-design/pro-layout';
import {connect, Dispatch} from 'umi';
import TableForm from './components/TableForm';
import Avatar from './components/Avatar';
import styles from './style.less';

type InternalNamePath = (string | number)[];

const {Option} = Select;
const {TextArea} = Input;

const fieldLabels = {
  name: '课程名称',
  owner: '开课教师',
  points: '学分',
  startDate: '生效日期',
  endDate: '结束日期',
  cover: '课程封面',
  description: '课程简介',
  books: '教材',
};

interface CourseReleaseProps {
  dispatch: Dispatch;
  submitting: boolean;
}

interface ErrorField {
  name: InternalNamePath;
  errors: string[];
}

const CourseRelease: FC<CourseReleaseProps> = ({
                                                 submitting,
                                                 dispatch,
                                               }) => {
  const [form] = Form.useForm();
  const [error, setError] = useState<ErrorField[]>([]);
  const getErrorInfo = (errors: ErrorField[]) => {
    const errorCount = errors.filter((item) => item.errors.length > 0).length;
    if (!errors || errorCount === 0) {
      return null;
    }
    const scrollToField = (fieldKey: string) => {
      const labelNode = document.querySelector(`label[for="${fieldKey}"]`);
      if (labelNode) {
        labelNode.scrollIntoView(true);
      }
    };
    const errorList = errors.map((err) => {
      if (!err || err.errors.length === 0) {
        return null;
      }
      const key = err.name[0] as string;
      return (
        <li key={key} className={styles.errorListItem} onClick={() => scrollToField(key)}>
          <CloseCircleOutlined className={styles.errorIcon}/>
          <div className={styles.errorMessage}>{err.errors[0]}</div>
          <div className={styles.errorField}>{fieldLabels[key]}</div>
        </li>
      );
    });
    return (
      <span className={styles.errorIcon}>
        <Popover
          title="表单校验信息"
          content={errorList}
          overlayClassName={styles.errorPopover}
          trigger="click"
          getPopupContainer={(trigger: HTMLElement) => {
            if (trigger && trigger.parentNode) {
              return trigger.parentNode as HTMLElement;
            }
            return trigger;
          }}
        >
          <CloseCircleOutlined/>
        </Popover>
        {errorCount}
      </span>
    );
  };

  const onFinish = (values: { [key: string]: any }) => {
    setError([]);
    dispatch({
      type: 'courseRelease/submitAdvancedForm',
      payload: values,
    });
  };

  const onFinishFailed = (errorInfo: any) => {
    setError(errorInfo.errorFields);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      hideRequiredMark
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <PageContainer content="在这里发布新的课程">
        <Card title="基本信息" className={styles.card} bordered={false}>
          <Row gutter={16}>
            <Col flex={14}>
              <Row gutter={16}>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item
                    label={fieldLabels.name}
                    name="name"
                    rules={[{required: true, message: '请输入课程名称'}]}
                  >
                    <Input placeholder="请输入课程名称"/>
                  </Form.Item>
                </Col>
                <Col xl={{span: 6, offset: 2}} lg={{span: 8}} md={{span: 12}} sm={24}>
                  <Form.Item
                    label={fieldLabels.points}
                    name="points"
                    rules={[{required: true, message: '请输入课程学分'}]}
                  >
                    <InputNumber min={0.5} max={20} style={{width: '100%'}}/>
                  </Form.Item>
                </Col>
                <Col xl={{span: 8, offset: 2}} lg={{span: 10}} md={{span: 24}} sm={24}>
                  <Form.Item
                    label={fieldLabels.owner}
                    name="owner"
                    rules={[{required: true, message: '请选择管理员'}]}
                  >
                    <Select placeholder="请选择管理员">
                      <Option value="xiao">付晓晓</Option>
                      <Option value="mao">周毛毛</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item
                    label={fieldLabels.startDate}
                    name="startDate"
                    rules={[{required: true, message: '请选择开始时间'}]}
                  >
                    <DatePicker showTime style={{width: '100%'}}/>
                  </Form.Item>
                </Col>
                <Col xl={{span: 6, offset: 2}} lg={{span: 8}} md={{span: 12}} sm={24}>
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
                <Avatar/>
              </Form.Item>
            </Col>
          </Row>
        </Card>
        <Card title="课程详情" className={styles.card} bordered={false}>
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
                label={fieldLabels.books}
                name="books"
                rules={[{required: true, message: '请输入所需教材'}]}
              >
                <TextArea rows={2} style={{width: '100%'}}/>
              </Form.Item>
            </Col>
          </Row>
        </Card>
        <Card title="学生管理" bordered={false}>
          <Form.Item name="members">
            <TableForm/>
          </Form.Item>
        </Card>
      </PageContainer>
      <FooterToolbar>
        {getErrorInfo(error)}
        <Button type="primary" onClick={() => form?.submit()} loading={submitting}>
          提交
        </Button>
      </FooterToolbar>
    </Form>
  );
};

export default connect(({loading}: { loading: { effects: { [key: string]: boolean } } }) => ({
  submitting: loading.effects['courseRelease/submitAdvancedForm'],
}))(CourseRelease);
