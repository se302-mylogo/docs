// eslint-disable-next-line import/no-extraneous-dependencies
import {Request, Response} from 'express';
import {homeworkOut, randomHomeworkSubmitOut} from '../../../mock/data';

export default {
  'GET  /teacher/reviews/:id': (_: Request, res: Response) => {
    res.send({
      status: 403,
      data: randomHomeworkSubmitOut(),
    });
  },

  'POST  /teacher/submits/:id': (_: Request, res: Response) => {
    res.send({
      status: 201,
      data: homeworkOut
    });
  },
};
