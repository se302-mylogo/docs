import {Request, Response} from 'express';
import {homeworkOut, media} from '../../../mock/data';

export default {
  'GET  /student/homeworks/:id': {
    status: 200,
    data: homeworkOut,
  },

  'POST  /student/homeworks/:id/submit': (_: Request, res: Response) => {
    res.send({
      status: 201,
      data: homeworkOut
    });
  },

  'POST /medias': (_: Request, res: Response) => {
    res.send({
      status: 201,
      data: [media],
    });
  },
};
