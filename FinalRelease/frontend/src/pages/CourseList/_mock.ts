import {Request, Response} from 'express';
import {courseOutFakeList} from "../../../mock/data";

export default {
  '/student/courses': (req: Request, res: Response) => {
    const {page, size} = req.query;
    const realPage: number = typeof page !== 'string' ? 1 : parseInt(page, 10);
    const realSize: number = typeof size !== 'string' ? 10 : parseInt(size, 10);
    const results = courseOutFakeList(realPage, realSize);
    res.send({
      status: 200,
      data: {
        results,
        count: 30, // define in mock
      },
    });
  }
};
