import React from 'react';
import moment from 'moment';
import styles from './index.less';

interface HomeworkListContentProps {
  homework: HomeworkSubmitOut;
}

const HomeworkListContent: React.FC<HomeworkListContentProps> = ({
                                                                   homework: {description, updateAt, author},
                                                                 }) => (
  <div className={styles.listContent}>
    <div className={styles.description}>{description}</div>
    <div className={styles.extra}>
      <a>{author.name}</a> 提交于<em>{moment(updateAt).format('YYYY-MM-DD HH:mm')}</em>
    </div>
  </div>
);

export default HomeworkListContent;
