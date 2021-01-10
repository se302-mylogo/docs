# API文档

## 约定

* 如无特殊说明，本文档中的接口均遵循《RESTful概念及其最佳实践》中的命名风格和语义，如下表所示，本文档中不再赘述：

| 方法   | 路径     | 语义                                                         | 响应包体                                 | 简写 |
| ------ | -------- | ------------------------------------------------------------ | ---------------------------------------- | ---- |
| GET    | /books   | 获取集合中的个体资源列表                                     | 一个列表，其中包含集合中的每个个体的数据 | L    |
| POST   | /books   | 根据请求报文包体中的数据创建该集合下的新资源（通常为新的个体） | 新的资源的数据                           | C    |
| PUT    | /books   | N/A （即不合法）                                             | N/A                                      |      |
| PATCH  | /books   | N/A                                                          | N/A                                      |      |
| DELETE | /books   | N/A                                                          | N/A                                      |      |
| GET    | /books/1 | 获取集合中指定ID的个体的数据                                 | 集合中指定ID的个体的数据                 | R    |
| POST   | /books/1 | N/A                                                          | N/A                                      |      |
| PUT    | /books/1 | 使用请求报文包体中的数据**完整替换**（可理解为删除后新建）服务端已有的该个体资源的数据 | 替换后的新资源个体的数据                 | U    |
| PATCH  | /books/1 | 使用请求报文包体中的数据**部分替换**（即：只替换包体中给出的部分，未给出的部分仍按原状）服务端已有的该个体资源的数据 | 替换后的新资源个体的数据                 | U    |
| DELETE | /books/1 | 删除集合中指定ID的个体                                       | 空                                       | D    |

* 如无特殊说明，本文档中API返回的HTTP状态码均遵循下列规范，之后不再赘述：
  * 200：操作成功
  * 201：POST成功创建
  * 204：DELETE成功删除，此时包体为空
  * 400：请求自身存在错误，例如缺少要求的数据，或数据格式错误
  * 403：因当前请求传递的凭据权限不足（或已过期），访问被禁止
  * 404：访问了不存在的URL路径，或在发起针对个体的请求时传递了不存在的资源ID
  * 500/502：后端程序异常，正常情况下不应出现

* 如无特殊说明，本文档中的接口均支持《RESTful概念及其最佳实践》中的下列扩展语义，且所需参数命名按照该文档中所述，本文中不再赘述：
  * 分页
  * 过滤
  * 排序
  * 投影：需要注意，JavaScript使用`camelCase`作为标准命名规范，而后端使用的Python以`snake_case`作为标准命名规范。为此，我们在后端程序中执行了特殊的处理，使其产生的JSON使用`camelCase`命名，但由于框架限制，在传递投影参数时，仍需要使用`snake_case`，如名为`createAt`的JSON键，在投影时应写为`create_at`。

## Data Schema

Data Schema以TypeScript形式给出. 注意：

* 若无特殊说明，所有时间相关的属性都以ISO8601字符串形式给出，前端可使用moment.js等库直接处理。
* Enum在TypeScript编译时将被替换为所对应的数值常量，因此服务端实际上返回的是数值。但在TypeScript中使用Enum可以强化代码可读性。
* 为增强可读性，我们将尽量避免使用extends等复用方式，而是将所有属性一并列出（所有类型均具有的属性除外）
* 若存在输入输出异构，则`TypeIn`表示`Type`的输入形式，`TypeOut`表示`Type`的输出形式
* **在输入类型中，若某个键的值需要指代一个`Media`，则我们使用目标`Media`的token（即UUID），而非ID**

```typescript
interface IPagedResponse<T> {
    count: number;
    results: T[];
}

interface IBaseEntity {
    id: number;
    createAt: string;
    updateAt: string;
}

/*
JSON标准定义的字符串不适合用于传输多行文本，无法很好传输文本中的缩进等情况。因此对于多行文本使用一个字符串数组来传输，数组中的每个元素为原文本中的一行（包括换行符），空行则为一个换行符；元素顺序为原文本中行的顺序。
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
    avatar: string; // Media token
    name: string;
    gender: Gender;
    role: Role.Student;
    school: string;
    age: number;
    grade: string;
    className: string;
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
    avatar: string; // Media token
    name: string;
    gender: Gender;
    role: Role.Teacher;
    school: string;
    telephone: string;
    title: string;
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
    answer: string|null; // 教师可以上传一个文件作为参考答案，若上传了参考答案，那么仅当学生提交了作业且在deadline之后才能下载参考答案。若不提供参考答案，则该选项需设为null
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
```

## API

* 由于学生和教师分别需要不同的API行为，故API存在两个顶级路径：

  * `/students` 学生相关API
  * `/teachers` 教师相关API

  例如：`/students/courses`，`/teachers/courses`等

* 为简洁起见，我们列出简表来表达接口简要语义。对于部分语义标准的接口，表中仅列出其输入/输出类型，如：`CourseIn/CourseOut`，`-`表示无需该部分类型，如`-/CourseOut`表示仅有输出类型。

* U包括部分（PATCH）与全量（PUT）替换。对于后者，输入为完整的输入类型。对于前者，输入为`Partial<T>`（https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype），且不再于表中额外注明部分替换的输入类型。

### 课程相关

* 集合名称：`courses`
* 语义简表：

|      | /students                     | /teachers                     |
| ---- | ----------------------------- | ----------------------------- |
| C    | N/A                           | CourseIn/CourseOut            |
| R    | -/CourseOut                   | -/CourseOut                   |
| U    | N/A                           | CourseIn/CourseOut            |
| D    | N/A                           | -/-                           |
| L    | `-/IPagedResponse<CourseOut>` | `-/IPagedResponse<CourseOut>` |

* `CourseIn`中不包含`teacher`的ID，此为用户审计的一部分，将由后端自动注入
* 列表的过滤参数：
  * `search`：搜索课程名称（基于前缀）
  * `my`: 取值为`true`（字符串）时，返回我的课程而非全部课程
* 额外API：
  * `/students/courses/:id/join`：加入课程
    * 方法：POST
    * 输入：`CourseMemberIn`，当且仅当输入提供的id与当前登录的学生id一致时操作成功
    * 输出：无
    * 如此设计是出于反CSRF并强制CORS预检的考虑
  * `/students/courses/:id/leave`：退出课程
    * 方法：POST
    * 输入：`CourseMemberIn`，当且仅当输入提供的id与当前登录的学生id一致时操作成功
    * 输出：无
  * `/student/courses/:id/joined`：查询当前登录的学生用户是否加入了`id`代表的课程
    * 方法：GET
    * 输入：无
    * 状态码：
      * 200：学生未加入该课程
      * 404：`id`课程不存在
      * 409：“Conflict”，学生已加入该课程
  * `/courses/:id/users`：课程学生列表
    * 方法：GET
    * 对两个顶级路径均提供
    * 输出：`IPagedResponse<Student>`

### 作业相关

* 集合名称：`homeworks`
* 语义简表：

|      | /students                       | /teachers                       |
| ---- | ------------------------------- | ------------------------------- |
| C    | N/A                             | `HomeworkIn/HomeworkOut`        |
| R    | -/HomeworkOut                   | -/HomeworkOut                   |
| U    | N/A                             | `HomeworkIn/HomeworkOut`        |
| D    | N/A                             | -/-                             |
| L    | `-/IPagedResponse<HomeworkOut>` | `-/IPagedResponse<HomeworkOut>` |

* 作业列表：
  * 若不提供过滤参数，对于学生，返回其参与的课程的作业列表；对于教师，返回其开设的所有课程的作业列表
  
  * 过滤参数：
    * `search`: 基于作业名称搜索，值为名称前缀
    
    * `available_before`: ISO8601字符串，仅返回`availableSince`在该参数取值之前的作业
    
    * `available_after`: ISO8601字符串，仅返回`availableSince`在该参数取值之后的作业
    
    * `deadline_before`: ISO8601字符串，仅返回`deadline`在该参数取值之前的作业
    
    * `deadline_after`: ISO8601字符串，仅返回`deadline`在该参数取值之后的作业
    
    * `courses`: 多值GET参数，表示所属课程ID，仅返回`course`在这些ID中的作业
  
* 额外API：
    * 参考答案相关：
      * `/student/homeworks/:id/answer`：供学生获取该作业的参考答案
        * 方法：GET
        * 当且仅当学生已提交作业，且`deadline`已过，方可访问参考答案文件（如若教师上传了答案）
        * 输出：若学生具有所需权限，则访问该路径会导致参考答案以附件形式下载
        * 状态码：
          * 200：参考答案将以附件形式下载
          * 404：教师未上传该作业的参考答案
          * 403：暂无权限访问参考答案
      * 教师可以通过常规PATCH或PUT方法来直接更新参考答案文件，若在更新时将`answer`键设为`null`，则会移除该作业的参考答案
      * `/teacher/homeworks/:id/answer`：供教师获取该作业的参考答案
        * 只要教师已经设置了该作业的参考答案，访问该路径将无条件导致下载参考答案文件

### 作业提交

* `/students/homeworks/:id/submit`提供学生侧作业提交页面所需语义，其语义等价于禁止DELETE的单例接口。注意`HomeworkSubmitIn`中并不包含`author`，该值作为用户审计由后端注入，其亦不包含`score`或`review`等由教师创建的内容
  * 在`deadline`之后，该接口的任何写操作均返回403
* 教师侧语义简表：
  * 集合名称：`submits`

|      | /teachers                             |
| ---- | ------------------------------------- |
| C    | N/A                                   |
| R    | -/HomeworkSubmitOut                   |
| U    | HomeworkReviewIn/HomeworkSubmitOut    |
| D    | N/A                                   |
| L    | `-/IPagedResponse<HomeworkSubmitOut>` |

* 教师侧提交列表：
  * 若不提供过滤参数，返回该教师布置的所有作业的所有作业提交列表（分页）
  * 过滤参数：
    * `homework`: 提交所属的作业的ID
    * `hw__courses`: 多值GET参数，表示提交可能属于的课程id
* 额外API：
  * `/teacher/reviews/: 提供连续批阅支持
    * 方法：GET
    * GET参数：`homework`，值为要进行连续批阅的作业的ID
    * 输出：HomeworkSubmitOut
    * 返回`homework`所对应的作业的一个作业提交
    * 状态码：
      * 200：返回一个提交
      * 404：没有更多的提交了
      * 400：必须提供`homework`参数
      * 403：`homework`不是当前教师用户布置的