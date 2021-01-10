import {Effect, Reducer} from 'umi';
import {addHomeworkOutList, deleteHomeworkOut, queryHomeworkOutList, updateHomeworkOutList} from '@/services/homework';

export interface StateType {
  list: HomeworkOut[];
  total: number;
}

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetch: Effect;
    submit: Effect;
    update: Effect;
  };
  reducers: {
    queryList: Reducer<StateType>;
    updateList: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'homeworkList',

  state: {
    list: [],
    total: 0,
  },

  effects: {
    * fetch({payload}, {put, call}) {
      const response = yield call(queryHomeworkOutList, 'teacher');
      yield put({
        type: 'queryList',
        payload: {
          total: response.data.count,
          list: Array.isArray(response.data.results) ? response.data.results : [],
        }
      });
    },

    * submit({payload}, {call, put}) {
      let callback;
      if (payload.id) {
        callback = Object.keys(payload).length === 1 ? deleteHomeworkOut : updateHomeworkOutList;
      } else {
        callback = addHomeworkOutList;
      }
      const response = yield call(callback, payload); // post
      yield put({
        type: 'queryList',
        total: response.data.count,
        payload: Array.isArray(response.data.results) ? response.data.results : [],
      });
    },

    * update({payload}, {call, put}) {
      const response = yield call(updateHomeworkOutList, payload.id, payload.data);
      yield put({
        type: 'updateList',
        payload: response.data,
      })
    }
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
      return {
        total,
        list,
      }
    }

  },
};

export default Model;
