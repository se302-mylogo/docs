import {Effect, Reducer} from 'umi';
import {attendCourse, queryCourses, queryCourseStudentList} from "@/services/course";
import {queryHomeworkOutList} from "@/services/homework";
import {useAccess} from "@@/plugin-access/access";
import {query} from "express";

export interface StateType {
  course: CourseOut | undefined,
  list: Student[],
  total: number,
}

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetch: Effect;
  };
  reducers: {
    query: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: "courseDetail",

  state: {
    course: undefined,
    list: [],
    total: 0,
  },

  effects: {
    * fetch({payload}, {call, put}) {
      const {id, filterProps} = payload
      const kind: string = 'student'
      const params: IRequestFilterOptions<HomeworkOut> = {
        courses: [id],
      }
      const course = yield call(queryCourses, id, kind);
      const homeworks = yield call(queryHomeworkOutList, kind,)
      const list = yield call(queryCourseStudentList, id, filterProps);
      yield put({
        type: 'query',
        payload: {
          course: course.data,
          list: Array.isArray(list.data.results) ? list.data.results : [],
          total: (list.data.count as number),
          homeworks: Array.isArray(homeworks.data.results) ? homeworks.data.results : [],
        },
      });
    },
  },

  reducers: {
    query(state, {payload}) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};

export default Model;
