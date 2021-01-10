import {Effect} from 'umi';
import {message} from 'antd';
import {Reducer} from '@@/plugin-dva/connect';
import {homeworkOut} from '@/../mock/data';
import {fakeSubmitForm, queryHomework} from '@/services/homework';

export interface StateType {
  item: HomeworkOut;
}

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetch: Effect;
    submitRegularForm: Effect;
  };
  reducers: {
    query: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'homeworkSubmit',

  state: {
    item: homeworkOut,
  },

  effects: {
    * fetch({payload}, {call, put}) {
      const response = yield call(queryHomework, payload);
      yield put({type: 'query', payload: response.data});
    },

    * submitRegularForm({payload}, {call}) {
      const result = yield call(fakeSubmitForm, payload);
      if (result.status === 201) message.success('提交成功');
      else if (result.status === 403) message.error('提交已过期的作业');
      else message.error('发生异常错误');
    },
  },

  reducers: {
    query(state, {payload}) {
      return {
        ...state,
        item: payload,
      };
    },
  },
};

export default Model;
