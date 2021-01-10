import {Avatar, Button, Card, Form, Input, List, Radio, Typography} from 'antd';
import React, {FC, useEffect, useState} from 'react';
import {Dispatch, Link} from 'umi';
import moment from 'moment';
import {connect} from "@@/plugin-dva/exports";
import {removeUndefined, setTimeRange} from "@/utils/utils";
import {StateType} from './model';
import StandardFormRow from './components/StandardFormRow';
import styles from './style.less';
import {LoadingOutlined} from "@ant-design/icons/lib";

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const FormItem = Form.Item;
const {Paragraph} = Typography;
const {Search} = Input;

interface CourseListProps {
  dispatch: Dispatch;
  courseList: StateType;
  loading: boolean;
}

const CourseList: FC<CourseListProps> = (props) => {
  const {
    loading,
    dispatch,
    courseList: {list, total},
  } = props;
  const [filterProps, setFilterProps] = useState<IRequestFilterOptions<HomeworkOut>>({
    page: 1, size: 12,
    search: undefined,
    available_since: undefined,
    available_before: undefined,
    deadline_since: undefined,
    deadline_before: undefined,
    course: undefined,
  });
  useEffect(() => {
    dispatch({
      type: 'courseList/fetch',
      payload: {
        ...filterProps,
      },
    });
  }, [1]);

  const fetchMore = () => {
    const page = filterProps.page ? filterProps.page + 1 : 1
    const payload = removeUndefined({...filterProps, page});
    setFilterProps({...payload})
    dispatch({
      type: 'courseList/appendFetch',
      payload,
    });
  }

  const retchEnd = () => {
    if (filterProps !== undefined && filterProps.page !== undefined && filterProps.size !== undefined)
      return filterProps.page * filterProps.size >= total
    return true
  }

  const loadMore = list.length > 0 && !retchEnd() && (
    <div style={{textAlign: 'center', marginTop: 16}}>
      <Button onClick={fetchMore} style={{paddingLeft: 48, paddingRight: 48}}>
        {loading ? (
          <span>
            <LoadingOutlined/> 加载中...
          </span>
        ) : (
          '加载更多'
        )}
      </Button>
    </div>
  );

  const cardList = list && (
    <List<CourseOut>
      rowKey="id"
      loading={loading}
      grid={{gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4}}
      dataSource={list}
      loadMore={loadMore}
      renderItem={(item) => (
        <List.Item>
          <Link to={`/courses/${item.id}`}>
            <Card className={styles.card} hoverable cover={<img alt={item.name} src={item.cover.url}/>}>
              <Card.Meta
                title={item.name}
                description={
                  <Paragraph className={styles.item} ellipsis={{rows: 2}}>
                    {item.teacher.avatar && <Avatar src={item.teacher.avatar.url} size="small" style={{marginRight: 5}}/>}
                    授课教师：{item.teacher.name}
                  </Paragraph>
                }
              />
              <div className={styles.cardItemContent}>
                <span>课程开始于{moment(item.startDate).fromNow()}</span>
              </div>
            </Card>
          </Link>
        </List.Item>
      )}
    />
  );

  return (
    <div className={styles.coverCardList}>
      <Card bordered={false}>
        <Form
          layout="inline"
          onValuesChange={({category}: { category: number }) => {
            const timeProps = setTimeRange(category)
            const page = 1
            const payload = removeUndefined({...filterProps, ...timeProps, page});
            setFilterProps({...payload})
            dispatch({
              type: 'courseList/fetch',
              payload,
            });
          }}
        >
          <StandardFormRow title="分类" block style={{paddingBottom: 11}}>
            <FormItem name="category">
              <RadioGroup defaultValue={2}>
                <RadioButton value={2}>我的当前课程</RadioButton>
                <RadioButton value={3}>我的已完成课程</RadioButton>
                <RadioButton value={0}>全部课程</RadioButton>
              </RadioGroup>
            </FormItem>
          </StandardFormRow>
          <Search
            placeholder="根据课程名检索"
            onSearch={(search: string) => {
              const page = 1
              const payload = removeUndefined({...filterProps, search, page});
              setFilterProps({...payload})
              dispatch({
                type: 'courseList/fetch',
                payload,
              });
            }}/>
        </Form>
      </Card>
      <div className={styles.cardList}>{cardList}</div>
    </div>
  );
};

export default connect(
  ({
     courseList,
     loading,
   }: {
    courseList: StateType;
    loading: { models: { [key: string]: boolean } };
  }) => ({
    courseList,
    loading: loading.models.courseList,
  }),
)(CourseList);
