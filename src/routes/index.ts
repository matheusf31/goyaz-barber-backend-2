import { Router } from 'express';

import appointmentsRouter from './appointments.routes';

const routes = Router();

// toda rota que inicia com /appointments será redirecionada para appointmentsRouter
routes.use('/appointments', appointmentsRouter);

export default routes;
