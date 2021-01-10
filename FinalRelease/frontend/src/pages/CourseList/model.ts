import {Effect, Reducer} from 'umi';
import {queryCourseList} from "@/services/course";

export interface StateType {
  list: CourseOut[];
  total: number;
}

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetch: Effect;
    appendFetch: Effect;
  };
  reducers: {
    queryList: Reducer<StateType>;
    appendList: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'courseList',

  state: {
    list: [],
    total: 0,
  },

  effects: {
    * fetch({payload}, {call, put}) {
      const response = yield call(queryCourseList, payload, 'student');
      debugger
      yield put({
        type: 'queryList',
        payload: {
          list: Array.isArray(response.data.results) ? response.data.results : [],
          total: response.data.count,
        }
      });
    },
    * appendFetch({payload}, {call, put}) {
      const response = yield call(queryCourseList, payload, 'student');
      yield put({
        type: 'appendList',
        list: Array.isArray(response.data.results) ? response.data.results : [],
        total: response.data.count,
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
    appendList(state, {list, total}) {
      return {
        ...state,
        list: (state as StateType).list.concat(list),
        total,
      };
    },
  },
};

export default Model;
