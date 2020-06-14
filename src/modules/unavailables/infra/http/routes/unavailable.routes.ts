import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import UnavailableController from '../controllers/UnavailableController';

const unavailableRouter = Router();

const unavailableController = new UnavailableController();

unavailableRouter.use(ensureAuthenticated);

unavailableRouter.post(
  '/set-unavailable',
  celebrate({
    [Segments.BODY]: {
      date: Joi.date().required(),
      is_unavailable: Joi.boolean().required(),
    },
  }),
  unavailableController.create,
);

export default unavailableRouter;
