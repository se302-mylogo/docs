import {Button, Card, Form, Input, InputNumber} from 'antd';
import {connect, Dispatch} from 'umi';
import React, {FC, useEffect} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import HomeworkContent from '@/pages/HomeworkReview/components/HomeworkContent';
import {StateType} from '@/pages/HomeworkReview/model';

const FormItem = Form.Item;
const {TextArea} = Input;

interface HomeworkReviewProps {
  submitting: boolean;
  homeworkReview: StateType;
  dispatch: Dispatch;
  location: Location;
}

const parseURL: (url: string) => { id: number } = (url: string) => {
  const a = document.createElement('a');
  a.href = url;
  return {
    // eslint-disable-next-line no-sparse-arrays,radix
    id: parseInt((a.pathname.match(/([^/?#]+)$/i) || [, ''])[1] as string),
  };
};

const HomeworkReview: FC<HomeworkReviewProps> = (props) => {
  const {
    submitting,
    homeworkReview: {homework},
    dispatch,
    location,
  } = props;
  const {id} = parseURL(location.pathname);

  useEffect(() => {
    dispatch({
      type: 'homeworkReview/fetch',
      payload: id,
    });
  }, [1]);

  const [form] = Form.useForm();
  const formItemLayout = {
    labelCol: {
      xs: {span: 24},
      sm: {span: 3},
    },
    wrapperCol: {
      xs: {span: 24},
      sm: {span: 3},
      md: {span: 20},
    },
  };

  const submitFormLayout = {
    wrapperCol: {
      xs: {span: 24, offset: 0},
      sm: {span: 10, offset: 7},
    },
  };

  const onFinish = (values: { [key: string]: any }) => {
    dispatch({
      type: 'homeworkReview/submitRegularForm',
      payload: values,
    });
  };

  const onFinishFailed = (errorInfo: any) => {
    // eslint-disable-next-line no-console
    console.log('Failed:', errorInfo);
  };

  return (
    <PageContainer>
      {homework !== undefined ? <HomeworkContent homework={homework}/> : <div/>}
      <Card bordered={false}>
        <Form
          hideRequiredMark
          style={{marginTop: 8}}
          form={form}
          name="basic"
          initialValues={{public: '1'}}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <FormItem
            {...formItemLayout}
            label="作业反馈"
            name="review"
            rules={[
              {
                required: true,
                message: '作业反馈不能为空',
              },
            ]}
          >
            <TextArea
              style={{minHeight: 50}}
              placeholder='请输入作业反馈'
              rows={6}
            />
          </FormItem>
          <FormItem
            {...formItemLayout}
            name="score"
            rules={[
              {
                required: true,
                message: '分数不能为空',
              },
            ]}
            initialValue={0}
            label='分数'
          >
            <InputNumber style={{width: '50%'}} min={0} max={homework?.homework.totalScore}/>
            <span className="ant-form-text">（满分{homework?.homework.totalScore}）</span>
          </FormItem>
          <FormItem {...submitFormLayout} style={{marginTop: 12}}>
            <Button
              type="primary"
              htmlType="submit"
              loading={submitting}
            >
              提交
            </Button>
            <Button
              style={{marginLeft: 8}}
              onClick={() => {
                form.resetFields()
              }}
            >
              清空当前
            </Button>
          </FormItem>
        </Form>
      </Card>
    </PageContainer>
  );
};

export default connect(
  ({
     homeworkReview,
     loading,
   }: {
    homeworkReview: StateType;
    loading: {
      effects: { [key: string]: boolean };
    };
  }) => ({
    homeworkReview,
    submitting: loading.effects['homeworkSubmit/submitRegularForm'],
  }),
)(HomeworkReview);
