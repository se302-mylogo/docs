import {request} from 'umi';

// homeworkReview
export async function queryAllSubmitHomeworkList(params: IRequestFilterOptions<HomeworkSubmitOut>) {
  return request('/teacher/homeworks/:id/submit', {
    params,
  });
}

export async function queryTeacherCourseIdList() {
  const params = {my: true, fields: ['id']};
  return request('/teacher/courses', {
    params,
  });
}

export async function queryTeacherHomeworkList() {
  const params = {fields: ['id', 'name']};
  return request('/teacher/homeworks', {
    params,
  });
}

export async function fakeSubmitForm(params: any) {
  return request('/student/homeworks/:id/submit', {
    method: 'POST',
    data: params,
  });
}

export async function queryHomework(params: any) {
  return request('/student/homeworks/:id', {
    method: 'GET',
    params,
  });
}

export async function teacherQueryHomeworkSubmitOut(id: number) {
  // eslint-disable-next-line no-useless-concat
  return request(`/teacher/submits/${id}`, {
    method: 'GET',
  });
}

export async function queryContinueHomeworkSubmitOut(params: number) {
  return request(`/teacher/reviews/${params}`, {
    method: 'GET',
  });
}

export async function teacherSubmitForm(params: any) {
  return request('/teacher/submits/:id', {
    method: 'POST',
    data: params,
  });
}

// homeworkList
export async function queryHomeworkOutList(kind:string) {
  return request(`/${kind}/homeworks`, {
    method: 'GET',
  });
}

export async function queryHomeworkOutListStudent(params: IRequestFilterOptions<HomeworkOut>) {
  return request('/student/homeworks', {
    method: 'GET',
    params,
  });
}

export async function releaseHomework(params: any) {
  return request('/teacher/homeworks', {
    method: 'POST',
    data: params,
  });
}


export async function deleteHomeworkOut(id: number) {
  return request(`/teacher/homeworks/${id}`, {
    method: 'DELETE'
  });
}

export async function addHomeworkOutList(params: IRequestFilterOptions<HomeworkOut>) {
  const {size = 5, ...restParams} = params;
  return request('/teacher/homeworks', {
    method: 'POST',
    params: {
      size,
    },
    data: {
      ...restParams,
      method: 'post',
    },
  });
}

export async function updateHomeworkOutList(id: number, data: HomeworkIn) {
  return request(`/teacher/homeworks/${id}`, {
    method: 'PATCH',
    data,
  });
}

// homeworkRelease
