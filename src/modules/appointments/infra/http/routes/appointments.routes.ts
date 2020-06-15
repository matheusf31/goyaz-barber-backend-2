import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

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

/**
 * User Appointment Controller
 */
appointmentsRouter.get(
  '/',
  celebrate({
    [Segments.QUERY]: {
      month: Joi.string().required(),
      year: Joi.string().required(),
    },
  }),
  userAppointmentsController.index,
);

appointmentsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      provider_id: Joi.string().uuid().required(),
      date: Joi.date().required(),
      service: Joi.string().required(),
    },
  }),
  userAppointmentsController.create,
);

appointmentsRouter.patch(
  '/user/cancel/:appointment_id',
  celebrate({
    [Segments.PARAMS]: {
      appointment_id: Joi.string().uuid().required(),
    },
  }),
  userAppointmentsController.update,
);

/**
 * Provider Appointment Controller
 */
appointmentsRouter.post(
  '/provider',
  celebrate({
    [Segments.BODY]: {
      user_id: Joi.string().uuid(),
      date: Joi.date().required(),
      service: Joi.string().required(),
      foreign_client_name: Joi.string(),
    },
  }),
  providerAppointmentController.create,
);

appointmentsRouter.delete(
  '/provider/delete/:appointment_id',
  celebrate({
    [Segments.PARAMS]: {
      appointment_id: Joi.string().uuid().required(),
    },
  }),
  providerAppointmentController.delete,
);

/**
 * Concluded Appointment Controller
 */
appointmentsRouter.patch(
  '/provider/conclude/:appointment_id',
  celebrate({
    [Segments.PARAMS]: {
      appointment_id: Joi.string().uuid().required(),
    },
    [Segments.BODY]: {
      concluded: Joi.boolean().required(),
    },
  }),
  concludedAppointmentController.update,
);

appointmentsRouter.get(
  '/info/:provider_id',
  celebrate({
    [Segments.PARAMS]: {
      provider_id: Joi.string().uuid().required(),
    },
    [Segments.QUERY]: {
      month: Joi.string().required(),
      year: Joi.string().required(),
    },
  }),
  appointmentsInfoController.index,
);

appointmentsRouter.put(
  '/additional',
  celebrate({
    [Segments.BODY]: {
      appointment_id: Joi.string().uuid().required(),
      additional: Joi.object({
        description: Joi.string().required(),
        value: Joi.number().required(),
      }).required(),
    },
  }),
  additionalController.update,
);

export default appointmentsRouter;
