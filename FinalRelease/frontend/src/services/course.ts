import {request} from 'umi';

// 获得student或teacher的courses列表
export async function queryCourseList(params: IRequestFilterOptions<CourseOut>, kind: string) {
  return request(`/${kind}/courses`, {
    method: 'GET',
    params
  });
}

// student或teacher的单个course, 访问不能访问的资源会返回404
export async function queryCourses(id: number, kind: string) {
  return request(`/${kind}/courses/${id}`, {
    method: 'GET',
  });
}


// 获得某一课程对应的student列表
export async function queryCourseStudentList(id: number, filterProps: IRequestFilterOptions<Student>, kind: string) {
  return request(`/${kind}/courses/${id}/users`, {
    method: 'GET',
    params: filterProps
  });
}

// 以下仅限teacher操作
// 提交单个course
export async function submitCourseOut(data: CourseIn) {
  return request(`/teacher/courses`, {
    method: 'POST',
    data,
  });
}

// 修改单个course
export async function updateCourseOutList(id: number, data: Partial<CourseIn>) {
  return request(`/teacher/courses/${id}`, {
    method: 'PATCH',
    data,
  });
}

// 获得我发布的课程的部分列表，用于布置作业时的选项
// TODO: 已经结束的课程认为也可以布置作业
export async function queryTeacherCourseInfoList(search: string) {
  let params = {my: true, fields: 'id,name'}
  if (search !== undefined) { // @ts-ignore
    params = {my: true, fields: 'id,name', search}
  }
  return request('/teacher/courses', {
    params,
  });
}
