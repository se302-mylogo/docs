// eslint-disable-next-line import/no-extraneous-dependencies
import {Request, Response} from 'express';
import {homeworkOut, media} from "../../../mock/data";

export default {
  'POST  /teacher/homeworks': (_: Request, res: Response) => {
    res.send({
      status: 201,
      data: homeworkOut
    });
  },

  'POST  /medias': (_: Request, res: Response) => {
    res.send({
      status: 201,
      data: media
    });
  },
};
