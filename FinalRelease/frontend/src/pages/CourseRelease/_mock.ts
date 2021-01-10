// eslint-disable-next-line import/no-extraneous-dependencies
import {Request, Response} from 'express';
import {courseOut} from "../../../mock/data";

export default {
  'POST  /teacher/courses': (_: Request, res: Response) => {
    res.send({
      status: 201,
      data: courseOut
    });
  },
};
