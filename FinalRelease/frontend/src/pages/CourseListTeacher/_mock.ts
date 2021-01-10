import {Request, Response} from "express";
import {courseOutFakeList, media} from "../../../mock/data";

export default {
  'GET  /teacher/courses': (req: Request, res: Response) => {
    const {page, size} = req.query;
    const realPage: number = typeof page !== 'string' ? 1 : parseInt(page, 10);
    const realSize: number = typeof size !== 'string' ? 10 : parseInt(size, 10);
    const results = courseOutFakeList(realPage, realSize);
    res.send({
      status: 200,
      data: {
        results,
        count: 4, // define in mock
      },
    });
  },
  'POST  /medias': (_: Request, res: Response) => {
    res.send({
      status: 201,
      data: media
    });
  },
};