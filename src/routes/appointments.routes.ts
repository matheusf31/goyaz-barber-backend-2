import { Router } from 'express';

const appointmentsRouter = Router();

appointmentsRouter.get('/', (req, res) => {
  return res.json({ ok: true });
});

export default appointmentsRouter;
