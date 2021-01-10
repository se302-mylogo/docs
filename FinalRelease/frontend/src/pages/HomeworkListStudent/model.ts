import {Effect, Reducer} from 'umi';
import {queryHomeworkOutListStudent} from '@/services/homework';

export interface StateType {
  list: HomeworkOut[];
  total: number;
}

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetch: Effect;
  };
  reducers: {
    queryList: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'homeworkListStudent',

  state: {
    list: [],
    total: 0,
  },

  effects: {
    * fetch({payload}, {put, call}) {
      const response = yield call(queryHomeworkOutListStudent, payload);
      yield put({
        type: 'queryList',
        payload: {
          total: response.data.count,
          list: Array.isArray(response.data.results) ? response.data.results : [],
        }
      });
    },
  },

  reducers: {
    queryList(state, {payload}) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};

export default Model;
