interface IPagedResponse<T> {
  count: number;
  results: (Partial<T>)[];
}

interface IRequestFilterOptions<T> {
  page?: number;
  size?: number;
  fields?: (keyof T)[];

  [name: string]: any;
}

interface IBaseEntity {
  id: number;
  createAt: string;
  updateAt: string;
}

/*
JSON标准定义的字符串不适合用于传输多行文本，无法很好传输文本中的缩进等情况。因此对于多行
文本使用一个字符串数组来传输，数组中的每个元素为原文本中的一行（包括换行符），空行则为一个
换行符；元素顺序为原文本中行的顺序。
*/
type LineArray = string[];
interface Media extends IBaseEntity {
  url: string; // 该文件的完整访问URL，可作为HTTP标签的src等属性的值
  downloadUrl: string; // 下载文件URL，访问该URL将导致浏览器下载该文件
  filename: string;
  size: number; // Bytes
}

enum Gender {
  Male = 0,
  Female,
}

enum Role {
  Student = 0,
  Teacher
}

interface StudentIn {
  username: string;
  password: string;
  email: string;
  name: string;
  gender: Gender;
  role: Role.Student;
  school: string;
  age: number;//
  grade: string;//
  className: string;//
}

interface Student extends IBaseEntity {
  username: string;
  email: string;
  avatar: Media;
  name: string;
  gender: Gender;
  role: Role.Student;
  school: string;
  age: number;
  grade: string;
  className: string;
}

interface TeacherIn {
  username: string;
  password: string;
  email: string;
  name: string;
  gender: Gender;
  role: Role.Teacher;
  school: string;
  telephone: string;//
  title: string;//
}

interface Teacher extends IBaseEntity {
  username: string;
  email: string;
  avatar: Media;
  name: string;
  gender: Gender;
  role: Role.Teacher;
  school: string;
  telephone: string;
  title: string;
}

interface CourseIn {
  name: string;
  startDate: string;
  endDate: string;
  points: number;
  cover: string; // Media token
  description: LineArray;
  references: LineArray;
}

interface CourseOut extends IBaseEntity {
  name: string;
  startDate: string;
  endDate: string;
  points: number;
  teacher: Teacher;
  cover: Media;
  description: LineArray;
  references: LineArray;
}

interface CourseMemberIn {
  student: number;
}

enum HomeworkStatus {
  Locked = 0,
  Open,
  Closed,
}

interface HomeworkIn {
  course: number;
  availableSince: string;
  deadline: string;
  status: HomeworkStatus;
  totalScore: number;
  name: string;
  description: LineArray;
  attachments: string[]; // Media token list
  answer: string | null; // 教师可以上传一个文件作为参考答案，若上传了参考答案，那么
  // 仅当学生提交了作业且在deadline之后才能下载参考答案。若不提供参考答案，则该选项需设为null
}

interface HomeworkOut extends IBaseEntity {
  course: CourseOut;
  availableSince: string;
  deadline: string;
  status: HomeworkStatus;
  totalScore: number;
  name: string;
  description: LineArray;
  attachments: Media[];
} // 通常HomeworkOut中不包含answer

interface HomeworkSubmitIn {
  homework: number;
  description: LineArray;
  attachments: string[]; // Media token list
}

interface HomeworkReviewIn {
  score: number;
  review: LineArray;
}

interface HomeworkSubmitOut extends IBaseEntity {
  homework: HomeworkOut;
  author: Student;
  description: LineArray;
  score: number;
  attachments: Media[];
  review: LineArray;
}
