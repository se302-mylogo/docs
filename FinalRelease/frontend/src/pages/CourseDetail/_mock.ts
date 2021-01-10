import {courseOutFakeList, studentFakeList} from "../../../mock/data";

export default {
  'GET  /teacher/courses/:id': {
    status: 200, data: courseOutFakeList(1, 1)[0],
  },

  'GET  /teacher/courses/:id/users': {
    status: 200, data: {
      count: 200,
      results: studentFakeList(200),
    }
  },

  'GET  /student/courses/:id': {
    status: 200, data: courseOutFakeList(1, 1)[0],
  },

  'GET  /student/courses/:id/users': {
    status: 200, data: {
      count: 200,
      results: studentFakeList(200),
    }
  },
};
