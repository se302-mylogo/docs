import {Effect} from 'umi';
import {message} from 'antd';
import {submitCourseOut} from "@/services/course";

export interface ModelType {
  namespace: string;
  state: {};
  effects: {
    submitAdvancedForm: Effect;
  };
}

const Model: ModelType = {
  namespace: 'courseRelease',

  state: {},

  effects: {
    * submitAdvancedForm({payload}, {call}) {
      const response = yield call(submitCourseOut, payload);
      if (response.status === 201) message.success(`提交成功！\n作业名：${response.data.name}`)
      else message.error('发生异常错误')
    },
  },
};

export default Model;
