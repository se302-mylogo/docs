import {Effect} from 'umi';
import {message} from 'antd';
import {Reducer} from '@@/plugin-dva/connect';
import {teacherQueryHomeworkSubmitOut, teacherSubmitForm} from "@/services/homework";

export interface StateType {
  homework: HomeworkSubmitOut | undefined;
}

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    submitRegularForm: Effect;
    fetch: Effect;
  };
  reducers: {
    query: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'homeworkReview',

  state: {
    homework: undefined,
  },

  effects: {
    * fetch({payload}, {call, put}) {
      const response = yield call(teacherQueryHomeworkSubmitOut, payload);
      yield put({type: 'query', payload: response.data});
    },

    * submitRegularForm({payload}, {call}) {
      const response = yield call(teacherSubmitForm, payload);
      if (response.status === 201) message.success('提交成功');
      else message.error('发生异常错误');
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
