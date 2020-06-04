import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import UnavailableController from '../controllers/UnavailableController';

const unavailableRouter = Router();

const unavailableController = new UnavailableController();

unavailableRouter.use(ensureAuthenticated);

unavailableRouter.post('/set-unavailable', unavailableController.create);

export default unavailableRouter;
