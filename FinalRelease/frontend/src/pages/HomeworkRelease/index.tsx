import {CloseCircleOutlined, UploadOutlined} from '@ant-design/icons';
import {Button, Card, Col, DatePicker, Form, Input, InputNumber, Popover, Row, Select, Upload,} from 'antd';
import React, {FC, useEffect, useState} from 'react';
import {FooterToolbar, PageContainer} from '@ant-design/pro-layout';
import {connect, Dispatch} from 'umi';
import {BasicCourseInfo, StateType} from "@/pages/HomeworkRelease/model";
import {UploadProps} from "antd/es/upload";
import styles from './style.less';

type InternalNamePath = (string | number)[];

const {Option} = Select;
const {TextArea} = Input;

const fieldLabels = {
  name: '作业名称',
  availableSince: '起始时间',
  deadline: '截止时间',
  course: '课程名称',
  range: '日期',
  status: '作业状态',
  totalScore: '作业分数',
  description: '作业描述',
  attachment: '附件',
  refer: '参考答案',
};

interface HomeworkReleaseProps {
  dispatch: Dispatch;
  homeworkRelease: StateType;
  submitting: boolean;
  loading: boolean;
}

interface ErrorField {
  name: InternalNamePath;
  errors: string[];
}

const uploadProps: UploadProps = {
  name: 'upfile',
  multiple: true,
  action: 'https://api.fourstring.dev/medias',
  method: 'POST',
};

const HomeworkRelease: FC<HomeworkReleaseProps> = (props) => {
  const {
    dispatch,
    homeworkRelease: {availableCourse},
    submitting,
    loading,
  } = props
  const [form] = Form.useForm();
  const [error, setError] = useState<ErrorField[]>([]);
  const [search, setSearch] = useState<string | undefined>(undefined);

  useEffect(() => {
    dispatch({
      type: 'homeworkRelease/fetch',
      search,
    })
  }, [1])

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
    const attachments = values.attachments.fileList.map((file: any) =>
      file.response.data.token);
    const param = values;
    param.attachments = attachments;
    param.answer = null;
    param.status = 1;
    param.description = [param.description];
    dispatch({
      type: 'homeworkRelease/submit',
      payload: param,
    });
  };

  const onFinishFailed = (errorInfo: any) => {
    setError(errorInfo.errorFields);
  };

  const handleSearch = (_: string | undefined) => {
    dispatch(
      {
        type: 'homeworkRelease/fetch',
        search: _,
      })
  };

  const handleChange = (value: string | undefined) => {
    setSearch(value);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      hideRequiredMark
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <PageContainer content="在这里发布新的作业">
        <Card title="基本信息" className={styles.card} bordered={false}>
          <Row gutter={16}>
            <Col lg={6} md={12} sm={24}>
              <Form.Item
                label={fieldLabels.course}
                name="course"
                rules={[{required: true, message: '请选择所属课程'}]}
              >
                <Select
                  showSearch
                  value={search}
                  placeholder="请选择所属课程"
                  loading={loading}
                  defaultActiveFirstOption={false}
                  showArrow={false}
                  filterOption={false}
                  onSearch={handleSearch}
                  onChange={handleChange}
                  notFoundContent={null}
                >
                  {availableCourse.map((course: BasicCourseInfo) => {
                    return <Option value={course.id}>{course.name}</Option>
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col xl={{span: 6, offset: 2}} lg={{span: 8}} md={{span: 12}} sm={24}>
              <Form.Item
                label={fieldLabels.name}
                name="name"
                rules={[{required: true, message: '请输入作业名称'}]}
              >
                <Input placeholder="请输入作业名称"/>
              </Form.Item>
            </Col>
            <Col xl={{span: 6, offset: 2}} lg={12} md={24} sm={24}>
              <Form.Item
                label={fieldLabels.totalScore}
                name="totalScore"
                initialValue={100}
                rules={[{required: true, message: '请输入作业分数'}]}
              >
                <InputNumber min={1} max={100} style={{width: '100%'}}/>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xl={{span: 6}} lg={{span: 8}} md={{span: 24}} sm={24}>
              <Form.Item
                label={fieldLabels.availableSince}
                name="availableSince"
                rules={[{required: true, message: '请选择开始时间'}]}
              >
                <DatePicker showTime style={{width: '100%'}}/>
              </Form.Item>
            </Col>
            <Col xl={{span: 6, offset: 2}} lg={{span: 8}} md={{span: 24}} sm={24}>
              <Form.Item
                label={fieldLabels.deadline}
                name="deadline"
                rules={[{required: true, message: '请选择结束时间'}]}
              >
                <DatePicker showTime style={{width: '100%'}}/>
              </Form.Item>
            </Col>
          </Row>
        </Card>
        <Card title="作业详情" className={styles.card} bordered={false}>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label={fieldLabels.description}
                name="description"
                rules={[{required: true, message: '请输入作业描述'}]}
              >
                <TextArea rows={6} style={{width: '100%'}}/>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label={fieldLabels.attachment}
                name="attachments"
                rules={[{required: false}]}
              >
                <Upload {...uploadProps}>
                  <Button icon={<UploadOutlined/>}>上传</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
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

export default connect(
  ({
     homeworkRelease,
     loading,
   }: {
    homeworkRelease: StateType;
    loading: {
      effects: { [key: string]: boolean },
      models: { [key: string]: boolean }
    };
  }) => ({
    homeworkRelease,
    loading: loading.models.homeworkRelease,
    submitting: loading.effects['homeworkRelease/submit'],
  }))(HomeworkRelease);
