import {Avatar, Button, Card, Descriptions, Divider, Image, Table} from 'antd';
import {GridContent, PageContainer, RouteContext} from '@ant-design/pro-layout';
import React, {FC, Fragment, useEffect, useState} from 'react';
import {connect, Dispatch} from 'umi';
import {parseURL} from "@/utils/utils";
import moment from "moment";
import styles from './style.less';
import {StateType} from "./model";

const columns = [
  {
    title: '头像',
    dataIndex: 'avatar',
    render: (data: { url: React.ReactNode }) => <Avatar src={data.url}/>,
    width: 80,
  },
  {
    title: '用户名',
    dataIndex: 'username',
  },
  {
    title: '姓名',
    dataIndex: 'name',
  },
  {
    title: '性别',
    dataIndex: 'gender',
    render: (text: number) => <div>{text === 0 ? '男' : '女'}</div>,
  },
  {
    title: '年级',
    dataIndex: 'grade'
  },
  {
    title: '年龄',
    dataIndex: 'age',
  },
  {
    title: '学校',
    dataIndex: 'school',
    width: 250,
  },
  {
    title: '班级',
    dataIndex: 'className',
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    width: 180,
  },
];

const paginationProps = {
  showSizeChanger: true,
  showQuickJumper: true,
};

interface CourseDetailProps {
  dispatch: Dispatch;
  courseDetail: StateType;
  location: Location;
}

const CourseDetail: FC<CourseDetailProps> = (props) => {
  const {
    dispatch,
    courseDetail: {course, list, total},
    location,
  } = props;

  const [filterProps, setFilterProps] = useState<IRequestFilterOptions<HomeworkOut>>({
    page: 1,
    size: 5,
  });

  useEffect(() => {
    const {id} = parseURL(location.pathname)
    dispatch({
      type: 'courseDetail/fetch',
      payload: {
        id,
        filterProps,
      }
    });
  }, [1])

  const [state, setState] = useState({
    operationKey: 'tab1',
    tabActiveKey: 'detail',
  });

  // const access = useAccess();

  const onTabChange = (tabActiveKey: string) => {
    setState({...state, tabActiveKey});
  };

  const description = (
    <RouteContext.Consumer>
      {({isMobile}) => (
        <Descriptions className={styles.headerList} size="small" column={isMobile ? 1 : 2}>
          <Descriptions.Item label="教师姓名">{course?.teacher.name}</Descriptions.Item>
          <Descriptions.Item label="课程名称">{course?.name}</Descriptions.Item>
          <Descriptions.Item label="开课时间">{course ? moment(course.startDate).format('LL') : ''}</Descriptions.Item>
          <Descriptions.Item label="截至时间">{course ? moment(course.endDate).format('LL') : ''}</Descriptions.Item>
        </Descriptions>
      )}
    </RouteContext.Consumer>
  );


  const action = (
    <RouteContext.Consumer>
      {({isMobile}) => {
        if (isMobile) {
          return (
            <Button type="primary">加入课程</Button>
          );
        }
        return (
          <Fragment>
            {/*<Button type="primary">加入课程</Button>*/}
          </Fragment>
        );
      }}
    </RouteContext.Consumer>
  );

  const extra = (
    <div className={styles.moreInfo}>
      <Image src={course?.cover.url} alt="img"/>
    </div>
  );

  const details = (
    <GridContent>
      <Card title="课程简介" style={{marginBottom: 24}} bordered={false}>
        {course?.name}（这里应该是课程简介）
      </Card>
      <Card title="参考教材" style={{marginBottom: 24}} bordered={false}>
        <Card type="inner" title="教材列表">
          {course?.references.map(item =>
            <>
              {item}
              <Divider style={{margin: '16px 0'}}/>
            </>)
          }
        </Card>
      </Card>
    </GridContent>
  );

  const studentList = (
    <GridContent>
      <Card>
        <Table<Student>
          columns={columns}
          dataSource={list}
          pagination={{
            pageSize: filterProps.size,
            onChange: (page, size) => {
              setFilterProps({page, size});
              dispatch({
                type: 'homeworkList/fetch',
                payload: {page, size,},
              });
            },
            total,
            ...paginationProps,
          }}
          scroll={{y: 260}}
        />,
      </Card>
    </GridContent>
  );

  return (
    <PageContainer
      title="课程详情"
      extra={action}
      className={styles.pageHeader}
      content={description}
      extraContent={extra}
      tabActiveKey={state.tabActiveKey}
      onTabChange={onTabChange}
      tabList={[
        {
          key: 'detail',
          tab: '详情',
        },
        {
          key: 'student',
          tab: '学生列表',
        },
      ]}
    >
      <div className={styles.main}>
        {state.tabActiveKey === 'detail' ? details : studentList}
      </div>
    </PageContainer>
  )
}

export default connect(
  ({
     courseDetail,
     loading,
   }: {
    courseDetail: StateType;
    loading: {
      models: { [key: string]: boolean };
      effects: { [key: string]: boolean };
    };
  }) => ({
    courseDetail,
    submitting: loading.effects['courseDetail/submit'],
    loading: loading.models.courseDetail,
  }),
)(CourseDetail);
