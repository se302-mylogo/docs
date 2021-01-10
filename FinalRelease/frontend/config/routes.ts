export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './user/login',
      },
      {
        name: '注册页',
        path: '/user/register',
        component: './user/Register',
      },
    ],
  },
  {
    path: '/welcome',
    name: 'welcome',
    icon: 'smile',
    component: './Welcome',
  },
  {
    path: '/admin',
    name: 'admin',
    icon: 'crown',
    access: 'canAdmin',
    component: './Admin',
    routes: [
      {
        path: '/admin/sub-page',
        name: 'sub-page',
        icon: 'smile',
        component: './Welcome',
      },
    ],
  },
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    name: '学生课程列表',
    icon: 'smile',
    path: '/course-list',
    component: './CourseList',
    access: 'studentRouteFilter',
  },
  {
    name: '教师课程列表',
    icon: 'smile',
    path: '/teachers/course-list',
    component: './CourseListTeacher',
    access: 'teacherRouteFilter',
  },
  {
    name: '发布课程',
    icon: 'smile',
    path: '/course-release',
    component: './CourseRelease',
  },
  {
    name: '学生作业列表',
    icon: 'smile',
    path: '/homework-list-student',
    component: './HomeworkListStudent',
    access: 'studentRouteFilter',
  },
  {
    name: '教师作业列表',
    icon: 'smile',
    path: '/homework-list',
    component: './HomeworkList',
    access: 'teacherRouteFilter',
  },
  {
    name: '发布作业',
    icon: 'smile',
    path: '/homework-release',
    component: './HomeworkRelease',
    access: 'teacherRouteFilter',
  },
  {
    path: '/homework-submit/:id',
    component: './HomeworkSubmit',
  },
  {
    name: '批改作业列表',
    icon: 'smile',
    path: '/submitlist',
    component: './SubmitList',
    access: 'teacherRouteFilter',
  },
  {
    // 提交反馈
    path: '/submits/review/:id',
    component: './HomeworkReview',
    access: 'teacherRouteFilter',
  },
  {
    //连续反馈
    path: '/reviews/:id',
    component: './HomeworkContinueReview',
    access: 'teacherRouteFilter',
  },
  {
    path: '/courses/:id',
    component: './CourseDetail',
  },
  {
    name: '个人设置',
    icon: 'smile',
    path: '/accountsettings',
    component: './AccountSettings',
  },
  {
    component: './404',
  },
  {
    component: './403',
  },
];
