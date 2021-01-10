import {Effect} from 'umi';
import {message} from 'antd';
import {Reducer} from "@@/plugin-dva/connect";
import {queryTeacherCourseInfoList} from "@/services/course";
import {releaseHomework} from "@/services/homework";

export interface BasicCourseInfo extends Partial<CourseOut> {
  id: number;
  name: string;
}

export interface StateType {
  availableCourse: BasicCourseInfo[],
}

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetch: Effect;
    submit: Effect;
  };
  reducers: {
    query: Reducer<StateType>;
  }
}

const Model: ModelType = {
  namespace: 'homeworkRelease',

  state: {
    availableCourse: [],
  },

  effects: {
    * submit({payload}, {call}) {
      const result = yield call(releaseHomework, payload);
      if (result.status === 201) message.success('提交成功');
      else message.error('提交失败');
    },

    * fetch({search}, {call, put}) {
      const availableCourse = yield call(queryTeacherCourseInfoList, search);
      // TODO：这里也有分页的话，拿到的课程名
      yield put({
        type: 'query',
        availableCourse: Array.isArray(availableCourse.data.results) ?
          availableCourse.data.results : [],
      });
    }
  },

  reducers: {
    query(state, {availableCourse}) {
      return {
        ...state,
        availableCourse,
      };
    },
  }
};

export default Model;
