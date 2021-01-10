import React, {FC, useEffect, useRef, useState} from 'react';
import {PlusOutlined} from '@ant-design/icons';
import {Avatar, Button, Card, Input, List, Progress, Radio,} from 'antd';
import {findDOMNode} from 'react-dom';
import {PageContainer} from '@ant-design/pro-layout';
import {connect, Dispatch, Link} from 'umi';
import moment from 'moment';
import {removeUndefined, setTimeRange} from "@/utils/utils";
import OperationModal from './components/OperationModal';
import {StateType} from './model';
import styles from './style.less';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const {Search} = Input;

interface CourseListTeacherProps {
  courseListTeacher: StateType;
  dispatch: Dispatch;
  loading: boolean;
}

const getPercentage = (startDate: string, endDate: string) => {
  const now = new Date().getTime();
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  return (now - start) / (end - start);
}

const getStatus = (startDate: string, endDate: string) => {
  const now = new Date().getTime();
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  if (now > end) {
    return 'success'
  }
  if (start < now && now < end) {
    return 'normal'
  }
  return 'error'
}

const ListContent = ({
                       data: {teacher, points, startDate, endDate},
                     }: {
  data: CourseOut;
}) => (
  <div className={styles.listContent}>
    <div className={styles.listContentItem}>
      <span>授课教师</span>
      <p>{teacher.name}</p>
    </div>
    <div className={styles.listContentItem}>
      <span>学分</span>
      <p>{points}</p>
    </div>
    <div className={styles.listContentItem}>
      <span>开始时间</span>
      <p>{moment(startDate).format('YYYY-MM-DD HH:mm')}</p>
    </div>
    <div className={styles.listContentItem}>
      <Progress percent={getPercentage(startDate, endDate)} status={getStatus(startDate, endDate)} strokeWidth={6}
                style={{width: 180}}/>
    </div>
  </div>
);

export const CourseListTeacher: FC<CourseListTeacherProps> = (props) => {
  const addBtn = useRef(null);
  const {
    loading,
    dispatch,
    courseListTeacher: {list, total},
  } = props;
  const [done, setDone] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [current, setCurrent] = useState<Partial<CourseOut> | undefined>(undefined);
  const [filterProps, setFilterProps] = useState<IRequestFilterOptions<CourseOut>>({
    page: 1, size: 5,
    search: undefined,
    available_since: undefined,
    available_before: undefined,
    deadline_since: undefined,
    deadline_before: undefined,
    course: undefined,
  });

  useEffect(() => {
    const payload = removeUndefined({...filterProps});
    dispatch({
      type: 'courseListTeacher/fetch',
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

  const showModal = () => {
    setVisible(true);
    setCurrent(undefined);
  };

  const showEditModal = (item: CourseOut) => {
    setVisible(true);
    setCurrent(item);
  };

  const extraContent = (
    <div className={styles.extraContent}>
      <RadioGroup defaultValue={2} onChange={event => {
        const timeProps = setTimeRange(event.target.value)
        const page = 1
        const payload = removeUndefined({...filterProps, ...timeProps, page});
        setFilterProps({...payload})
        dispatch({
          type: 'courseListTeacher/fetch',
          payload,
        });
      }}>
        <RadioButton value={2}>进行中</RadioButton>
        <RadioButton value={3}>已完成</RadioButton>
        <RadioButton value={0}>全部</RadioButton>
      </RadioGroup>
      <Search
        className={styles.extraContentSearch}
        placeholder="根据课程名检索"
        onSearch={(search: string) => {
          const page = 1
          const payload = removeUndefined({...filterProps, search, page});
          setFilterProps({...payload})
          dispatch({
            type: 'courseListTeacher/fetch',
            payload,
          });
        }}/>
    </div>
  );

  const setAddBtnblur = () => {
    if (addBtn.current) {
      // eslint-disable-next-line react/no-find-dom-node
      const addBtnDom = findDOMNode(addBtn.current) as HTMLButtonElement;
      setTimeout(() => addBtnDom.blur(), 0);
    }
  };

  const handleDone = () => {
    setAddBtnblur();
    setDone(false);
    setVisible(false);
  };

  const handleCancel = () => {
    setAddBtnblur();
    setVisible(false);
  };

  const handleSubmit = (values: CourseIn) => {
    const id = current?.id;
    setAddBtnblur();
    setDone(true);
    dispatch({
      type: 'courseListTeacher/submit',
      payload: {id, ...values},
    });
  };

  return (
    <div>
      <PageContainer>
        <div className={styles.standardList}>
          <Card
            className={styles.listCard}
            bordered={false}
            title="课程列表"
            style={{marginTop: 24}}
            bodyStyle={{padding: '0 32px 40px 32px'}}
            extra={extraContent}
          >
            <Button
              type="dashed"
              style={{width: '100%', marginBottom: 8}}
              onClick={showModal}
              ref={addBtn}
            >
              <PlusOutlined/>
              添加
            </Button>

            <List
              size="large"
              rowKey="id"
              loading={loading}
              dataSource={list}
              pagination={{
                onChange: (page, size) => {
                  setFilterProps({...filterProps, page, size});
                  dispatch({
                    type: 'courseListTeacher/fetch',
                    payload: {page, size,},
                  });
                },
                ...paginationProps,
              }}
              renderItem={(item) => {
                return (
                  <List.Item
                    actions={[
                      <a
                        key="edit"
                        onClick={(e) => {
                          e.preventDefault();
                          showEditModal(item);
                        }}
                      >
                        编辑
                      </a>,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={<Avatar src={item.cover.url} shape="square" size="large"/>}
                      title={<Link to={`/courses/${item.id}`}>{item.name}</Link>}
                      description={item.description}
                    />
                    <ListContent data={item}/>
                  </List.Item>
                )
              }}
            />
          </Card>
        </div>
      </PageContainer>

      <OperationModal
        done={done}
        current={current}
        visible={visible}
        onDone={handleDone}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default connect(
  ({
     courseListTeacher,
     loading,
   }: {
    courseListTeacher: StateType;
    loading: {
      models: { [key: string]: boolean };
    };
  }) => ({
    courseListTeacher,
    loading: loading.models.courseListTeacher,
  }),
)(CourseListTeacher);
