import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import AppointmentsController from '../controllers/AppointmentsController';
import ProviderAppointmentController from '../controllers/ProviderAppointmentController';
import CancelAppointmentController from '../controllers/CancelAppointmentController';
import ConcludedAppointmentController from '../controllers/ConcludedAppointmentController';
import UserAppointmentsController from '../controllers/UserAppointmentsController';

const appointmentsRouter = Router();

const appointmentsController = new AppointmentsController();
const providerAppointmentController = new ProviderAppointmentController();
const cancelAppointmentController = new CancelAppointmentController();
const concludedAppointmentController = new ConcludedAppointmentController();
const userAppointmentsController = new UserAppointmentsController();

appointmentsRouter.use(ensureAuthenticated);

appointmentsRouter.get('/', userAppointmentsController.index);

appointmentsRouter.post('/', appointmentsController.create);

appointmentsRouter.patch(
  '/cancel/:appointment_id',
  cancelAppointmentController.update,
);

appointmentsRouter.patch(
  '/conclude/:appointment_id',
  concludedAppointmentController.update,
);

appointmentsRouter.post('/provider', providerAppointmentController.create);

export default appointmentsRouter;
