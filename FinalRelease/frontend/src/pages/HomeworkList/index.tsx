import React, {FC, useEffect, useRef, useState} from 'react';
import {PlusOutlined} from '@ant-design/icons';
import {Button, Card, Input, List, Radio} from 'antd';
import {findDOMNode} from 'react-dom';
import {PageContainer} from '@ant-design/pro-layout';
import {connect, Dispatch,} from 'umi';
import moment from 'moment';
import {removeUndefined, setTimeRange} from "@/utils/utils";
import OperationModal from './components/OperationModal';
import {StateType} from './model';
import styles from './style.less';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const {Search} = Input;

interface HomeworkListProps {
  homeworkList: StateType;
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
      <span>开始时间</span>
      <p>{moment(availableSince).format('YYYY-MM-DD HH:mm')}</p>
    </div>
    <div className={styles.listContentItem}>
      <span>结束时间</span>
      <p>{moment(deadline).format('YYYY-MM-DD HH:mm')}</p>
    </div>
  </div>
);

export const HomeworkList: FC<HomeworkListProps> = (props) => {
  const addBtn = useRef(null);
  const {
    loading,
    dispatch,
    homeworkList: {list, total},
  } = props;
  const [done, setDone] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [current, setCurrent] = useState<Partial<HomeworkOut> | undefined>(undefined);
  const [filterProps, setFilterProps] = useState<IRequestFilterOptions<HomeworkOut>>({
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
      type: 'homeworkList/fetch',
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

  const showEditModal = (item: Partial<HomeworkOut>) => {
    setCurrent(item);
    setVisible(true);
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
        <RadioButton value={0}>全部</RadioButton>
        <RadioButton value={1}>已锁定</RadioButton>
        <RadioButton value={2}>进行中</RadioButton>
        <RadioButton value={3}>已截至</RadioButton>
      </RadioGroup>
      <Search
        className={styles.extraContentSearch}
        placeholder="根据作业名检索"
        onSearch={(search: string) => {
          const page = 1
          const payload = removeUndefined({...filterProps, search, page});
          setFilterProps({...payload})
          dispatch({
            type: 'homeworkList/fetch',
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

  const handleSubmit = (data: HomeworkIn) => {
    const id = current?.id;
    setAddBtnblur();
    setDone(true);
    dispatch({
      type: 'homeworkList/update',
      payload: {id, data},
    });
  };

  return (
    <div>
      <PageContainer>
        <div className={styles.standardList}>
          <Card
            className={styles.listCard}
            bordered={false}
            title="作业列表"
            style={{marginTop: 24}}
            bodyStyle={{padding: '0 32px 40px 32px'}}
            extra={extraContent}
          >
            <Button
              type="dashed"
              style={{width: '100%', marginBottom: 8}}
              // onClick={() => history.push('/homework-release')}
              onClick={showModal}
              ref={addBtn}
            >
              <PlusOutlined/>
              添加新的作业
            </Button>

            <List
              size="small"
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
                    title={item.name}
                    description={item.description}
                  />
                  <ListContent data={item}/>
                </List.Item>
              )}
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
     homeworkList,
     loading,
   }: {
    homeworkList: StateType;
    loading: {
      models: { [key: string]: boolean };
    };
  }) => ({
    homeworkList,
    loading: loading.models.homeworkList,
  }),
)(HomeworkList);
