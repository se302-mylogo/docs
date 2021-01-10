import React, {FC, useEffect, useState} from 'react';
import {Card, Input, List, Radio} from 'antd';
import {PageContainer} from '@ant-design/pro-layout';
import {connect, Dispatch, Link} from 'umi';
import moment from 'moment';
import {removeUndefined, setTimeRange} from "@/utils/utils";
import {StateType} from './model';
import styles from './style.less';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const {Search} = Input;

interface HomeworkListStudentProps {
  homeworkListStudent: StateType;
  dispatch: Dispatch;
  loading: boolean;
}

const map: Map<HomeworkStatus, string> = new Map();
map.set(0, "已锁定")
map.set(1, "已开放")
map.set(2, "已截至")

const ListContent = ({data: {course, totalScore, availableSince, deadline, status}}: {
  data: HomeworkOut;
}) => (
  <div className={styles.listContent}>
    <div className={styles.listContentItem}>
      <span>所属课程</span>
      <p>{course.name}</p>
    </div>
    <div className={styles.listContentItem}>
      <span>状态</span>
      <p>{map.get(status)}</p>
    </div>
    <div className={styles.listContentItem}>
      <span>分数</span>
      <p>{totalScore}</p>
    </div>
    <div className={styles.listContentItem}>
      <span>开放时间</span>
      <p>{moment(availableSince).format('YYYY-MM-DD HH:mm')}</p>
    </div>
    <div className={styles.listContentItem}>
      <span>截止日期</span>
      <p>{moment(deadline).format('YYYY-MM-DD HH:mm')}</p>
    </div>
  </div>
);

export const HomeworkListStudent: FC<HomeworkListStudentProps> = (props) => {
  const {
    loading,
    dispatch,
    homeworkListStudent: {list, total},
  } = props;
  const [filterProps, setFilterProps] = useState<IRequestFilterOptions<HomeworkOut>>({
    page: 1,
    size: 5,
    search: undefined,
    available_since: undefined,
    available_before: undefined,
    deadline_since: undefined,
    deadline_before: undefined,
    course: undefined,
  })


  useEffect(() => {
    const payload = removeUndefined({...filterProps});
    dispatch({
      type: 'homeworkListStudent/fetch',
      payload,
    });
  }, [1]);

  const paginationProps = {
    showSizeChanger: true,
    showQuickJumper: true,
    total,
    pageSize: filterProps.size,
    page: filterProps.page,
  };

  const extraContent = (
    <div className={styles.extraContent}>
      <RadioGroup defaultValue={2} onChange={event => {
        const timeProps = setTimeRange(event.target.value)
        const page = 1
        const payload = removeUndefined({...filterProps, ...timeProps, page});
        setFilterProps({...payload})
        dispatch({
          type: 'homeworkListStudent/fetch',
          payload,
        });
      }}>
        <RadioButton value={0}>全部</RadioButton>
        <RadioButton value={1}>已锁定</RadioButton>
        <RadioButton value={2}>进行中</RadioButton>
        <RadioButton value={3}>已截至</RadioButton>
      </RadioGroup>
      <Search
        className={styles.extraContentSearch}
        placeholder="根据作业名检索"
        value={filterProps.search}
        onSearch={(search: string) => {
          const page = 1
          const payload = removeUndefined({...filterProps, search, page});
          setFilterProps({...payload})
          dispatch({
            type: 'homeworkListStudent/fetch',
            payload,
          });
        }}/>
    </div>
  );

  return (
    <div>
      <PageContainer>
        <div className={styles.standardList}>
          <Card
            title="作业列表"
            className={styles.listCard}
            bordered={false}
            style={{marginTop: 24}}
            bodyStyle={{padding: '0 32px 40px 32px'}}
            extra={extraContent}
          >
            <List
              size="large"
              rowKey="id"
              loading={loading}
              pagination={{
                // position: 'both',
                onChange: (page, size) => {
                  setFilterProps({page, size});
                  dispatch({
                    type: 'homeworkList/fetch',
                    payload: {page, size,},
                  });
                },
                ...paginationProps,
              }}
              dataSource={list}
              renderItem={(item) => (
                <Link to={`/homework-submit/${item.id}`}>
                  <List.Item>
                    <List.Item.Meta
                      title={item.name}
                      description={item.description?.map(sentence => `${sentence}`)}
                    />
                    <ListContent data={item}/>
                  </List.Item>
                </Link>
              )}
            />
          </Card>
        </div>
      </PageContainer>
    </div>
  );
};

export default connect(
  ({
     homeworkListStudent,
     loading,
   }: {
    homeworkListStudent: StateType;
    loading: {
      models: { [key: string]: boolean };
    };
  }) => ({
    homeworkListStudent,
    loading: loading.models.homeworkListStudent,
  }),
)(HomeworkListStudent);
