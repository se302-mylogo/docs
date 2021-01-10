import React, {FC} from 'react';
import {Collapse, Upload} from 'antd';
import {transMedia} from "@/utils/utils";

const {Panel} = Collapse;

interface HomeworkContentProps {
  homework: HomeworkSubmitOut;
}

const HomeworkContent: FC<HomeworkContentProps> = (props) => {
  const {homework} = props;

  const active = ['question', 'answer'];
  if (homework.review.length > 0) active.push('review');

  return (
    <Collapse defaultActiveKey={active}>
      <Panel header="作业信息" key="question">
        <p>作业题目：{homework.homework.name}</p>
        <p>作业描述：{homework.homework.description}</p>
      </Panel>
      <Panel header="学生答案" key="answer">
        {homework.description.map((sentence) => {
          return <p>{sentence}</p>;
        })}
      </Panel>
      <Panel header="相关附件" key="attachments">
        <Upload
          listType="picture"
          defaultFileList={homework.attachments.map(media => transMedia(media))}
          className="upload-list-inline"
        />
      </Panel>
      {homework.review.length > 0 ? (
        <Panel header="已提交评论" key="review">
          <p>
            分数：{homework.score}/{homework.homework.totalScore}
          </p>
          {homework.review.map((sentence) => {
            return <p>{sentence}</p>;
          })}
        </Panel>
      ) : (
        <></>
      )}
    </Collapse>
  );
};

export default HomeworkContent;
