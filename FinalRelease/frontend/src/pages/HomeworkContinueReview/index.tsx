import {Button, Card, Col, Empty, Form, Input, InputNumber, Row} from 'antd';
import {connect, Dispatch, useHistory} from 'umi';
import React, {FC, useEffect} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import HomeworkContent from '@/pages/HomeworkReview/components/HomeworkContent';
import {StateType} from '@/pages/HomeworkReview/model';

const FormItem = Form.Item;
const {TextArea} = Input;

interface HomeworkContinueReviewProps {
  submitting: boolean;
  loading: boolean;
  homeworkContinueReview: StateType;
  dispatch: Dispatch;
  location: Location;
  history: History;
}

const parseURL: (url: string) => { id: undefined | string } = (url: string) => {
  const a = document.createElement('a');
  a.href = url;
  return {
    // eslint-disable-next-line no-sparse-arrays
    id: (a.pathname.match(/([^/?#]+)$/i) || [, ''])[1],
  };
};

const HomeworkContinueReview: FC<HomeworkContinueReviewProps> = (props) => {
  const {
    submitting,
    loading,
    homeworkContinueReview: {homework},
    dispatch,
    location,
  } = props;

  const {id} = parseURL(location.pathname);
  const [form] = Form.useForm();
  const history = useHistory();

  useEffect(() => {
    dispatch({
      type: 'homeworkContinueReview/fetch',
      payload: id,
    });
  }, [1]);

  if (homework && homework.review.length > 0) {
    form.setFieldsValue({
      review: homework.review,
      score: homework.score,
    });
  }

  const formItemLayout = {
    labelCol: {
      xs: {span: 24},
      sm: {span: 5},
    },
    wrapperCol: {
      xs: {span: 24},
      sm: {span: 5},
      md: {span: 18},
    },
  };

  const submitFormLayout = {
    wrapperCol: {
      xs: {span: 24, offset: 5},
      sm: {span: 24, offset: 5},
    },
  };

  const onFinish = (values: { [key: string]: any }) => {
    dispatch({
      type: 'homeworkContinueReview/next',
      payload: values,
    });
  };

  const onFinishFailed = (errorInfo: any) => {
    // eslint-disable-next-line no-console
    console.log('Failed:', errorInfo);
  };

  return (
    <PageContainer>
      {homework ?
        <Row gutter={[16, 24]}>
          <Col span={14}>
            <HomeworkContent homework={homework}/>
          </Col>
          <Col span={10}>
            <Card bordered>
              <Form
                hideRequiredMark
                form={form}
                name="basic"
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
                      message: "请输入作业反馈"
                    },
                  ]}
                >
                  <TextArea
                    style={{minHeight: 50}}
                    placeholder="请输入作业反馈"
                    rows={10}
                  />
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  name="score"
                  rules={[{required: true, message: '请输入作业分数'}]}
                  label='作业分数'
                >
                  <InputNumber
                    style={{width: '50%'}}
                    defaultValue={homework?.score}
                    min={0}
                    max={homework?.homework?.totalScore}
                    onChange={(score) => form.setFieldsValue({score})}
                  />
                  <span className="ant-form-text">（满分{homework?.homework?.totalScore}）</span>
                </FormItem>
                <FormItem {...submitFormLayout} style={{marginTop: 50}}>
                  <Button
                    type="primary"
                    loading={submitting || loading}
                    htmlType="submit"
                  >
                    提交并批改下一份
                  </Button>
                  <Button
                    style={{marginLeft: 8}}
                    onClick={() =>
                      dispatch({
                        type: 'homeworkContinueReview/fetch',
                        payload: id,
                      })
                    }
                  >
                    跳过
                  </Button>
                </FormItem>
              </Form>
            </Card>
          </Col>
        </Row> :
        <Card>
          <Empty
            description={
              <span>没有需要批改的作业</span>
            }
          >
            <Button type="primary" onClick={() => {
              history.push('/submitlist')
            }}>返回作业列表</Button>
          </Empty>
        </Card>
      }
    </PageContainer>
  );
}


export default connect(
  ({
     homeworkContinueReview,
     loading,
   }: {
    homeworkContinueReview: StateType;
    loading: {
      models: { [key: string]: boolean };
      effects: { [key: string]: boolean };
    };
  }) => ({
    homeworkContinueReview,
    submitting: loading.effects['homeworkContinueReview/next'],
    loading: loading.models.homeworkContinueReview,
  }),
)(HomeworkContinueReview);
