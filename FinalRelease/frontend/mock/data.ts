import '../config/schema';

export const media: Media = {
  id: 1,
  createAt: '2020-1-1',
  updateAt: '2021-1-1',
  url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png', // 该文件的完整访问URL，可作为HTTP标签的src等属性的值
  downloadUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  filename: 'xxx.png',
  size: 2034, // Bytes
};

export const student: Student = {
  id: 1,
  createAt: '2020-1-1',
  updateAt: '2021-1-1',
  username: 'username',
  avatar: media,
  name: 'name',
  gender: 1,
  role: 0,
  age: 18,
  grade: 'grade',
  className: 'class',
  school: 'Shanghai Jiao Tong University',
  email: 'student@sjtu.edu.cn',
};

export const teacher: Teacher = {
  id: 1,
  createAt: '2020-1-1',
  updateAt: '2021-1-1',
  username: '教师名',
  avatar: media,
  name: '教师名',
  gender: 0,
  role: 1,
  telephone: '1332896121479',
  email: 'teacher@sjtu.edu.cn',
  school: 'Shanghai Jiao Tong University',
  title: 'Professor'
};

const course = ['编译原理', '机器学习', '软件工程原理', '计算机系统工程', '操作系统'];

const courseMediaList = [
  {
    id: 1,
    createAt: '2020-1-1',
    updateAt: '2021-1-1',
    url: 'https://i.loli.net/2020/11/18/Qtxr9RNzMXnldLP.png', // 该文件的完整访问URL，可作为HTTP标签的src等属性的值
    downloadUrl: 'https://i.loli.net/2020/11/18/Qtxr9RNzMXnldLP.png',
    filename: 'xxx.png',
    size: 2034, // Bytes
  }, {
    id: 1,
    createAt: '2020-1-1',
    updateAt: '2021-1-1',
    url: 'https://i.loli.net/2020/11/18/eNzUItvAyCPEciT.png', // 该文件的完整访问URL，可作为HTTP标签的src等属性的值
    downloadUrl: 'https://i.loli.net/2020/11/18/eNzUItvAyCPEciT.png',
    filename: 'xxx.png',
    size: 2034, // Bytes
  }, {
    id: 1,
    createAt: '2020-1-1',
    updateAt: '2021-1-1',
    url: 'https://i.loli.net/2020/11/18/CYjF1wZ2umcBEW8.png', // 该文件的完整访问URL，可作为HTTP标签的src等属性的值
    downloadUrl: 'https://i.loli.net/2020/11/18/CYjF1wZ2umcBEW8.png',
    filename: 'xxx.png',
    size: 2034, // Bytes
  }
];

const homeworkName = [
  '编译原理第一次作业',
  '机器学习第一次作业',
  '软件工程原理第一次作业',
  '计算机系统工程第一次作业',
  '操作系统第一次作业',
  '编译原理第二次作业',
  '机器学习第二次作业',
  '软件工程原理第二次作业',
  '计算机系统工程第二次作业',
  '操作系统第二次作业',
];


const user = [
  '付小小',
  '曲丽丽',
  '林东东',
  '周星星',
  '吴加好',
  '朱偏右',
  '鱼酱',
  '乐哥',
  '谭小仪',
  '仲尼',
];


const studentAnswer = [
  '这里是学生对作业的回答的第一行\n',
  '这里是学生对作业的回答的第二行\n',
  '这里是学生对作业的回答的第三行\n',
  '这里是学生对作业的回答的第四行\n',
];

const review = [
  '这里是关于作业的反馈的第一行\n',
  '这里是关于作业的反馈的第二行\n',
  '这里是关于作业的反馈的第三行\n',
];

export const courseOut: CourseOut = {
  id: 1,
  createAt: '2020-1-1',
  updateAt: '2021-1-1',
  name: '编译原理',
  startDate: 'string',
  endDate: 'string',
  points: 100,
  teacher: teacher,
  cover: media,
  description: [
    '这里是描述的第一行',
    '这里是描述的第二行',
  ],
  references: [
    '1、电路，James W. Nilsson, Susan Riedel. 电子工业出版社, 2015年3月第10版；',
    '2、电路, 邱关源. 高等教育出版社, 2006年5月第5版；',
    '3、电路与电子线路基础（电路部分），王志功，沈永朝，赵鑫泰. 高等教育出版社，2015年7月第二版；',
    '4、电路原理，于歆杰，朱桂萍，陆文娟. 清华大学出版社，2007年3月；',
  ]
};

export function studentFakeList(count: number): Student[] {
  const list = [];
  for (let i = 0; i < count; i += 1) {
    list.push({
      id: i,
      createAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 2 * i).toString(),
      updateAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 2 * i).toString(),
      username: user[i % 10],
      name: user[i % 10],
      gender: i % 2,
      role: 0,
      age: 18 + (i % 4),
      grade: '大三',
      className: `F180370${(1 + (i % 4)).toString()}`,
      school: 'Shanghai Jiao Tong University',
      avatar: media,
      email: 'student@sjtu.edu.cn'
    });
  }
  return list;
}

export function courseOutFakeList(page: number, size: number): CourseOut[] {
  const list = [];
  for (let i = (page - 1) * size; i < page * size && i < 30; i += 1) {
    list.push({
      id: i,
      createAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 2 * i).toString(),
      updateAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 2 * i).toString(),
      name: course[i % course.length],
      startDate: new Date(new Date().getTime() - 1000 * 60 * 60 * 2 * i).toString(),
      endDate: new Date(new Date().getTime() - 1000 * 60 * 60 * 2 * i).toString(),
      points: 1 + i % 3,
      teacher: teacher,
      cover: courseMediaList[i % courseMediaList.length],
      description: [
        '这里是描述的第一行',
        '这里是描述的第二行',
      ],
      references: [
        '1、电路，James W. Nilsson, Susan Riedel. 电子工业出版社, 2015年3月第10版；',
        '2、电路, 邱关源. 高等教育出版社, 2006年5月第5版；',
        '3、电路与电子线路基础（电路部分），王志功，沈永朝，赵鑫泰. 高等教育出版社，2015年7月第二版；',
        '4、电路原理，于歆杰，朱桂萍，陆文娟. 清华大学出版社，2007年3月；',
      ]
    });
  }
  return list;
}

export function partialCourseOutFakeList(count: number): Partial<CourseOut>[] {
  const list = [];
  for (let i = 0; i < count; i += 1) {
    list.push({
      id: i,
      name: course[i % 5],
    });
  }
  return list;
}

export const homeworkOut: HomeworkOut = {
  id: 1,
  createAt: '2020-1-1',
  updateAt: '2021-1-1',
  course: courseOut,
  availableSince: '2020-10-10',
  deadline: '2020-10-30',
  status: 0,
  totalScore: 100,
  name: '计算机系统工程lab3',
  description: [
    'After you have passed the grade test, you need first package your code and rename the file\n',
    'lab3_xxx.tar.gz to lab3_[your student ID].tar.gz. For example, if your student ID is\n',
    '518000900000, then the file name should be lab3_518000900000.tar.gz, and no any other\n',
    'letters are included. You can use the following commands to finish this step.\n',
  ],
  attachments: [media],
};

export function homeworkOutFakeList(page: number, size: number): HomeworkOut[] {
  const list = [];
  const count = 200;
  for (let i = (page - 1) * size; i < page * size && i < count; i += 1) {
    list.push({
      id: 2139045 + i,
      createAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 2 * i).toString(),
      updateAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 2 * i).toString(),
      course: courseOut,
      availableSince: new Date(new Date().getTime() - 1000 * 60 * 60 * 2 * i).toString(),
      deadline: new Date(new Date().getTime() - 1000 * 60 * 60 * 2 * i).toString(),
      status: i % 3,
      totalScore: 100,
      name: homeworkName[i % homeworkName.length],
      description: [
        '这是对于作业的描述的第一行\n',
        '这是对于作业的描述的第二行\n',
        '这是对于作业的描述的第三行\n'
      ],
      attachments: [media],
    });
  }
  return list;
}

export function partialHomeworkOutFakeList(count: number): Partial<HomeworkOut>[] {
  const list = [];
  for (let i = 0; i < count; i += 1) {
    list.push({
      id: i,
      course: courseOut,
      status: i % 3,
      name: homeworkName[i % homeworkName.length],
    });
  }
  return list;
}


export function randomHomeworkSubmitOut(): HomeworkSubmitOut {
  const i = Math.floor(Math.random() * 100);
  const homework = homeworkOutFakeList(1, 100);
  return {
    id: i,
    createAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 2 * i).toString(),
    updateAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 2 * i).toString(),
    homework: homework[i],
    author: student[i % 10],
    description: studentAnswer,
    score: Math.ceil(Math.random() * 50) + 50,
    attachments: [media],
    review: ['这里是关于作业的反馈的第一行\n', '这里是关于作业的反馈的第二行\n'],
  };
}

export function homeworkSubmitOutFakeList(page: number, size: number): HomeworkSubmitOut[] {
  const list = [];
  const count = 200;
  const student = studentFakeList(10);
  for (let i = (page - 1) * size; i < page * size && i < count; i += 1) {
    list.push({
      id: 2139045 + i,
      createAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 2 * i).toString(),
      updateAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 2 * i).toString(),
      homework: homeworkOutFakeList(1, 1)[0],
      author: student[i % student.length],
      description: studentAnswer,
      score: Math.ceil(Math.random() * 50) + 50,
      attachments: [media],
      review: review,
    });
  }

  return list;
}
