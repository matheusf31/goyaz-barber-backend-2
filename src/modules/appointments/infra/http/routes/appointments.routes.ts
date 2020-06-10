import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import AppointmentsController from '../controllers/AppointmentsController';
import ProviderAppointmentController from '../controllers/ProviderAppointmentController';
import UserCancelAppointmentController from '../controllers/UserCancelAppointmentController';
import ConcludedAppointmentController from '../controllers/ConcludedAppointmentController';
import UserAppointmentsController from '../controllers/UserAppointmentsController';
import AppointmentsInfoController from '../controllers/AppointmentsInfoController';

const appointmentsRouter = Router();

const appointmentsController = new AppointmentsController();
const providerAppointmentController = new ProviderAppointmentController();
const userCancelAppointmentController = new UserCancelAppointmentController();
const concludedAppointmentController = new ConcludedAppointmentController();
const userAppointmentsController = new UserAppointmentsController();
const appointmentsInfoController = new AppointmentsInfoController();

appointmentsRouter.use(ensureAuthenticated);

appointmentsRouter.get('/', userAppointmentsController.index);
appointmentsRouter.post('/', appointmentsController.create);
appointmentsRouter.delete('/:appointment_id', appointmentsController.delete);

appointmentsRouter.patch(
  '/cancel/:appointment_id',
  userCancelAppointmentController.update,
);

appointmentsRouter.patch(
  '/conclude/:appointment_id',
  concludedAppointmentController.update,
);

appointmentsRouter.post('/provider', providerAppointmentController.create);

appointmentsRouter.get('/info', appointmentsInfoController.index);

export default appointmentsRouter;
