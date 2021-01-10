// eslint-disable-next-line import/no-extraneous-dependencies
import {Request, Response} from 'express';
import {homeworkOut, homeworkSubmitOutFakeList} from '../../../mock/data';

const homework: HomeworkSubmitOut = homeworkSubmitOutFakeList(1, 1)[0];

export default {
  'GET  /teacher/submits/:id': {
    status: 200,
    data: homework,
  },

  'POST  /teacher/submits/:id': (_: Request, res: Response) => {
    res.send({
      status: 201,
      data: homeworkOut
    });
  }
}