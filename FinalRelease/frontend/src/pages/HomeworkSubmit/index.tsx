import {Alert, Button, Card, Col, Divider, Form, Input, Row, Typography, Upload} from 'antd';
import {connect, Dispatch} from 'umi';
import React, {FC, useEffect} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import {UploadOutlined} from '@ant-design/icons/lib';
import {StateType} from '@/pages/HomeworkSubmit/model';
import {UploadProps} from 'antd/lib/upload';

const {Title, Paragraph} = Typography;
const {TextArea} = Input;
const FormItem = Form.Item;

interface HomeworkSubmitProps {
  submitting: boolean;
  loading: boolean;
  dispatch: Dispatch;
  homeworkSubmit: StateType;
}

const uploadProps: UploadProps = {
  name: 'upfile',
  multiple: true,
  action: '/medias',
  method: 'POST',
};

export const HomeworkSubmit: FC<HomeworkSubmitProps> = (props) => {
  const {
    submitting,
    dispatch,
    homeworkSubmit: {item},
  } = props;
  const [form] = Form.useForm();
  const formItemLayout = {
    labelCol: {
      xs: {span: 24},
      sm: {span: 2},
    },
    wrapperCol: {
      xs: {span: 24},
      sm: {span: 4},
      md: {span: 22},
    },
  };
  const submitFormLayout = {
    wrapperCol: {
      xs: {span: 24, offset: 8},
    },
  };

  useEffect(() => {
    dispatch({
      type: 'homeworkSubmit/fetch',
      payload: {
        id: 1,
      },
    });
  }, [1]);

  const warning = () => {
    if ((new Date(item.deadline).getTime()) < (new Date().getTime())) {
      return true
    }
    return false
  }

  const onFinish = (values: { [key: string]: any }) => {
    const attachments =
      values.attachments === undefined
        ? 0
        : values.attachments.fileList.map((file: any) => file.response.data.id);
    const payload: HomeworkSubmitIn = {
      homework: item.id, // the id of homework
      description: values.description,
      attachments,
    };
    dispatch({
      type: 'homeworkSubmit/submitRegularForm',
      payload,
    });
  };

  const onFinishFailed = (errorInfo: any) => {
    // eslint-disable-next-line no-console
    console.log('Failed:', errorInfo);
  };

  return (
    <PageContainer>
      <Card>
        <Row gutter={[16, 24]}>
          <Col span={12}>
            <Typography>
              <Title level={3}>{item.name}</Title>
              <Divider/>
              <Row>
                <Col span={8}>
                  <Paragraph>截至日期：{item.deadline} </Paragraph>
                </Col>
                <Col span={8}>
                  <Paragraph>得分：{item.totalScore}</Paragraph>
                </Col>
                <Col span={8}/>
              </Row>
              <Divider/>
              <Paragraph>{item.description}</Paragraph>
            </Typography>
          </Col>
          <Col span={12}>
            <Card title="提交">
              {warning() && <Alert
                message="警告"
                description="当前作业已截至，您的作业会被标记为迟交！"
                type="warning"
                showIcon
                closable
              />}
              <Card bordered={false} type="inner">
                <Form
                  hideRequiredMark
                  style={{marginTop: 8,}}
                  form={form}
                  name="basic"
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                >
                  <FormItem
                    {...formItemLayout}
                    label="回答"
                    name="description"
                    rules={[{
                      required: true,
                      message: "请输入你的作业回答",
                    },]}
                  >
                    <TextArea
                      style={{minHeight: 32,}}
                      placeholder='请输入你的作业回答'
                      rows={6}
                    />
                  </FormItem>
                  <FormItem
                    {...formItemLayout}
                    label='备注'
                    name="remarks"
                    rules={[{required: false,}]}
                  >
                    <TextArea
                      style={{
                        minHeight: 32,
                      }}
                      placeholder='请输入你的作业备注'
                      rows={2}
                    />
                  </FormItem>
                  <FormItem
                    style={{textAlign: 'center'}}
                    name="attachments"
                  >
                    <Upload {...uploadProps}>
                      <Button>
                        <UploadOutlined/> 点击上传附件
                      </Button>
                    </Upload>
                  </FormItem>
                  <FormItem
                    {...submitFormLayout}
                    style={{
                      marginTop: 32,
                    }}
                  >
                    <Button type="primary" onClick={() => form?.submit()} loading={submitting}>
                      提交
                    </Button>
                    <Button
                      style={{marginLeft: 5,}}
                      onClick={() => {
                        form.resetFields();
                      }}
                    >
                      清空当前
                    </Button>
                  </FormItem>
                </Form>
              </Card>
            </Card>
          </Col>
        </Row>
      </Card>
    </PageContainer>
  );
};

export default connect(
  ({
     homeworkSubmit,
     loading,
   }: {
    homeworkSubmit: StateType;
    loading: {
      effects: { [key: string]: boolean };
    };
  }) => ({
    homeworkSubmit,
    submitting: loading.effects['homeworkSubmit/submitRegularForm'],
  }),
)(HomeworkSubmit);
