import {Effect, Reducer} from 'umi';
import {queryAllSubmitHomeworkList, queryTeacherCourseIdList, queryTeacherHomeworkList,} from '@/services/homework';

export interface BasicHomeworkInfo extends Partial<HomeworkOut> {
  id: number;
  course: CourseOut;
  name: string;
}

export interface BasicCourseInfo extends Partial<CourseOut> {
  id: number;
  name: string;
}

export interface StateType {
  list: HomeworkSubmitOut[];
  total: number;
  availableHomework: BasicHomeworkInfo[];
  availableCourse: BasicCourseInfo[];
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
  namespace: 'submitList',

  state: {
    list: [],
    total: 0,
    availableHomework: [],
    availableCourse: [],
  },

  effects: {
    * fetch({payload}, {call, put}) {
      const response = yield call(queryAllSubmitHomeworkList, payload);
      const availableHomework = yield call(queryTeacherHomeworkList);
      const availableCourse = yield call(queryTeacherCourseIdList);

      yield put({
        type: 'queryList',
        count: response.data.count,
        all: Array.isArray(response.data.results) ? response.data.results : [],
        hw: Array.isArray(availableHomework.data.results) ? availableHomework.data.results : [],
        course: Array.isArray(availableCourse.data.results) ? availableCourse.data.results : [],
      });
    },
    * appendFetch({payload}, {call, put}) {
      const response = yield call(queryAllSubmitHomeworkList, payload);
      yield put({
        type: 'appendList',
        payload: Array.isArray(response.data.results) ? response.data.results : [],
      });
    },
  },

  reducers: {
    queryList(state, {all, hw, course, count}) {
      return {
        ...state,
        total: count,
        availableHomework: hw,
        availableCourse: course,
        list: all,
      };
    },
    appendList(state, {all, count}) {
      return {
        ...state,
        availableHomework: (state as StateType).availableHomework,
        availableCourse: (state as StateType).availableCourse,
        list: (state as StateType).list.concat(all),
        total: count,
      };
    },
  },
};

export default Model;
