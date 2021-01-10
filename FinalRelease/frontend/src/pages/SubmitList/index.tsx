import React, {FC, useEffect, useState} from 'react';
import {Button, Card, Col, Form, Input, List, Row, Select, Tag} from 'antd';
import {connect, Dispatch, Link, useHistory} from 'umi';
import HomeworkListContent from './components/ArticleListContent';
import {BasicCourseInfo, BasicHomeworkInfo, StateType} from './model';
import StandardFormRow from './components/StandardFormRow';
import TagSelect from './components/TagSelect';
import styles from './style.less';

const {Option} = Select;
const FormItem = Form.Item;

interface SubmitListProps {
  dispatch: Dispatch;
  submitList: StateType;
  loading: boolean;
}

const SubmitList: FC<SubmitListProps> = (
  {
    dispatch,
    submitList: {list, total, availableHomework, availableCourse},
    loading,
  }) => {
  const [selectedId, setSelectedId] = React.useState<number | undefined>(undefined);
  const [filterProps, setFilterProps] = useState<IRequestFilterOptions<HomeworkOut>>({
    page: 1,
    size: 5,
  });

  const [form] = Form.useForm();

  const history = useHistory();

  useEffect(() => {
    dispatch({
      type: 'submitList/fetch',
      payload: {
        ...filterProps,
      },
    });
  }, [1]);

  const paginationProps = {
    showSizeChanger: true,
    showQuickJumper: true,
  };

  const startContinueReview = () => {
    history.push(`/reviews/${selectedId}`);
  };

  return (
    <>
      <Card bordered={false}>
        <Form
          layout="inline"
          form={form}
          onValuesChange={(changed, value) => {
            dispatch({
              type: 'submitList/fetch',
              payload: {
                fields: value,
                page: 1,
                size: filterProps.size,
              },
            });
          }}
        >
          {availableCourse.length > 0 && (
            <StandardFormRow title="按课程过滤" block style={{paddingBottom: 10}}>
              <FormItem name="courses">
                <TagSelect expandable>
                  {availableCourse.map((course: BasicCourseInfo) => {
                    return <TagSelect.Option value={course.id}>{course.name}</TagSelect.Option>;
                  })}
                </TagSelect>
              </FormItem>
            </StandardFormRow>
          )}
          <StandardFormRow title="按作业名过滤" block style={{paddingBottom: 10}}>
            <FormItem name="homework" style={{minWidth: '20%'}}>
              <Select placeholder="作业名" mode="multiple">
                {availableHomework.length > 0 &&
                availableHomework.map((value: BasicHomeworkInfo) => {
                  return <Option value={value.id}>{value.name}</Option>;
                })}
              </Select>
            </FormItem>
          </StandardFormRow>
          <StandardFormRow title="按作业连续批改" grid last>
            <Input.Group compact style={{width: '100%'}}>
              <Select
                showSearch
                placeholder="选择作业"
                style={{minWidth: 200, width: '60%'}}
                disabled={availableHomework.length === 0}
                onChange={(value: number) => setSelectedId(value)}
              >
                {availableHomework.length > 0 &&
                availableHomework.map((value: BasicHomeworkInfo) => {
                  return <Option value={value.id}>{value.name}</Option>;
                })}
              </Select>
              <Button disabled={typeof selectedId !== 'number'} onClick={startContinueReview}>
                开始连续批阅
              </Button>
            </Input.Group>
          </StandardFormRow>
        </Form>
      </Card>
      <Card
        style={{marginTop: 24}}
        bordered={false}
        bodyStyle={{padding: '8px 32px 32px 32px'}}
      >
        <List<HomeworkSubmitOut>
          size="large"
          rowKey="id"
          itemLayout="vertical"
          dataSource={list}
          loading={loading}
          pagination={{
            position: 'both',
            pageSize: filterProps.size,
            onChange: (page, size) => {
              setFilterProps({page, size});
              dispatch({
                type: 'submitList/fetch',
                payload: {
                  page,
                  size,
                },
              });
            },
            total,
            ...paginationProps,
          }}
          renderItem={(item) => (
            <Link to={`/submits/review/${item.id}`}>
              <List.Item key={item.id} extra={<div className={styles.listItemExtra}/>}>
                <List.Item.Meta
                  title={
                    <div className={styles.listItemMetaTitle}>
                      {item.homework.name}(编号:{item.id})
                    </div>
                  }
                  description={
                    <span>
                      <Tag>{item.homework.course.name}</Tag>
                      <Tag>未批改</Tag>
                    </span>
                  }
                />
                <Row>
                  <Col span={14}>
                    <HomeworkListContent homework={item}/>
                  </Col>
                  <Col span={14}>
                    <Button/>
                  </Col>
                </Row>
              </List.Item>
            </Link>
          )}
        />
      </Card>
    </>
  );
};

export default connect(
  ({
     submitList,
     loading,
   }: {
    submitList: StateType;
    loading: { models: { [key: string]: boolean } };
  }) => ({
    submitList,
    loading: loading.models.submitList,
  }),
)(SubmitList);
