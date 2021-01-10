import {Effect} from 'umi';
import {message} from 'antd';
import {Reducer} from '@@/plugin-dva/connect';
import {teacherSubmitForm, queryContinueHomeworkSubmitOut} from "@/services/homework";

export interface StateType {
  homework: HomeworkSubmitOut | undefined;
}

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetch: Effect;
    next: Effect;
  };
  reducers: {
    query: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'homeworkContinueReview',

  state: {
    homework: undefined,
  },

  effects: {
    * fetch({payload}, {call, put}) {
      const next = yield call(queryContinueHomeworkSubmitOut, payload);
      if (next.status === 200) {
        message.success('提交成功并加载下一页')
        yield put({type: 'query', payload: next.data});
        return;
      }
      if (next.status === 403) {
        message.success('已到达最后一页');
        yield put({type: 'query', payload: null});
        return;
      }
      message.error('发生异常错误');
    },

    * next({payload}, {call, put}) {
      const response = yield call(teacherSubmitForm, payload);
      if (response.status !== 201) message.error('发生异常错误');

      const next = yield call(queryContinueHomeworkSubmitOut, payload);

      if (next.status === 200) {
        message.success('提交成功并加载下一页')
        yield put({type: 'query', payload: next.data});
        return;
      }
      if (next.status === 403) {
        message.success('已到达最后一页');
        yield put({type: 'query', payload: null});
        return;
      }
      message.error('发生异常错误');
    },
  },

  reducers: {
    query(state, {payload}) {
      return {
        ...state,
        homework: payload,
      };
    },
  },
};

export default Model;
