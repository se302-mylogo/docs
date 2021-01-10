import {Effect, Reducer} from 'umi';
import {queryCourseList, updateCourseOutList} from "@/services/course";

export interface StateType {
  list: CourseOut[];
  total: number,
}

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetch: Effect;
    submit: Effect;
  };
  reducers: {
    queryList: Reducer<StateType>;
    updateList: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'courseListTeacher',

  state: {
    list: [],
    total: 0,
  },

  effects: {
    * fetch({payload}, {call, put}) {
      const kind = 'teacher'
      const response = yield call(queryCourseList, payload, kind);
      debugger
      yield put({
        type: 'queryList',
        payload: {
          list: Array.isArray(response.data.results) ? response.data.results : [],
          total: response.data.count,
        }
      });
    },

    * submit({payload}, {call, put}) {
      const response = yield call(updateCourseOutList, payload.id, payload.data);
      yield put({
        type: 'queryList',
        payload: response,
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
    updateList(state, {payload}) {
      // eslint-disable-next-line prefer-const
      let {list, total} = state as StateType;
      (state as StateType).list.forEach(((value, index, array) => {
        if (value.id === payload.id) {
          array.splice(index, 1, payload)
          list = array
        }
      }))
      return {total, list}
    }
  },
};

export default Model;
