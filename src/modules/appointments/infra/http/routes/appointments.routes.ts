import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ProviderAppointmentController from '../controllers/ProviderAppointmentController';
import ConcludedAppointmentController from '../controllers/ConcludedAppointmentController';
import UserAppointmentsController from '../controllers/UserAppointmentsController';
import AppointmentsInfoController from '../controllers/AppointmentsInfoController';
import AdditionalController from '../controllers/AdditionalController';

const appointmentsRouter = Router();

const providerAppointmentController = new ProviderAppointmentController();
const concludedAppointmentController = new ConcludedAppointmentController();
const userAppointmentsController = new UserAppointmentsController();
const appointmentsInfoController = new AppointmentsInfoController();
const additionalController = new AdditionalController();

appointmentsRouter.use(ensureAuthenticated);

appointmentsRouter.get('/', userAppointmentsController.index);
appointmentsRouter.post('/', userAppointmentsController.create);
appointmentsRouter.patch(
  '/cancel/:appointment_id',
  userAppointmentsController.update,
);

appointmentsRouter.patch(
  '/conclude/:appointment_id',
  concludedAppointmentController.update,
);

appointmentsRouter.post('/provider', providerAppointmentController.create);
appointmentsRouter.delete(
  '/:appointment_id',
  providerAppointmentController.delete,
);

appointmentsRouter.get('/info', appointmentsInfoController.index);

appointmentsRouter.put('/additional', additionalController.update);

export default appointmentsRouter;
