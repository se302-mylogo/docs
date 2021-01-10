import {Request, Response} from 'express';
import {homeworkSubmitOutFakeList, partialHomeworkOutFakeList,} from '../../../mock/data';

function getFakeList(req: Request, res: Response) {
  const {page, size} = req.query;
  const realPage: number = typeof page !== 'string' ? 1 : parseInt(page, 10);
  const realSize: number = typeof size !== 'string' ? 5 : parseInt(size, 10);
  const results = homeworkSubmitOutFakeList(realPage, realSize);
  return res.json({
    status: 200,
    data: {
      results,
      count: 200, // define in mock
    },
  });
}

export default {
  'GET  /teacher/homeworks/:id/submit': getFakeList,

  'GET  /teacher/homeworks': {
    status: 200,
    data: {
      results: partialHomeworkOutFakeList(5),
      count: 5,
    }
  },
};
