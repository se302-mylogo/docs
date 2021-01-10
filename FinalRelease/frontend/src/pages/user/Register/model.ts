import {Effect, Reducer} from 'umi';
import {register} from "@/services/user";

export interface StateType {
  status?: 'ok' | 'error';
  currentAuthority?: 'user' | 'guest' | 'admin';
}

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    submit: Effect;
  };
  reducers: {
    registerHandle: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'userAndRegister',

  state: {
    status: undefined,
  },

  effects: {
    * submit({payload}, {call, put}) {
      const response = yield call(register, payload);
      yield put({
        type: 'registerHandle',
        payload: response,
      });
    },
  },

  reducers: {
    registerHandle(state, {payload}) {
      return {
        ...state,
        status: payload.status,
      };
    },
  },
};

export default Model;
