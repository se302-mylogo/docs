import {Request, Response} from 'express';
import {homeworkOut, homeworkOutFakeList} from "../../../mock/data";

export default {
  '/teacher/homeworks': (req: Request, res: Response) => {
    const {page, size} = req.query;
    const realPage: number = typeof page !== 'string' ? 1 : parseInt(page, 10);
    const realSize: number = typeof size !== 'string' ? 10 : parseInt(size, 10);
    const results = homeworkOutFakeList(realPage, realSize);
    res.send({
      status: 200,
      data: {
        results,
        count: 200, // define in mock
      },
    });
  },

  'PATCH  /teacher/homeworks/:id': {
    status: 204,
    data: homeworkOut,
  },

  'DELETE  /teacher/homeworks/:id': {
    status: 204
  }
};
