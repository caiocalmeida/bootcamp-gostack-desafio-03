import { Router } from 'express';

import StudentController from './app/controllers/StudentController';
import SessionController from './app/controllers/SessionController';
import ServicePlanController from './app/controllers/ServicePlanController';

import authMiddleware from './app/middleware/auth';

const routes = new Router();

routes.post('/session', SessionController.store);

routes.use(authMiddleware);

routes.post('/student', StudentController.store);

routes.post('/service-plan', ServicePlanController.store);
routes.get('/service-plan', ServicePlanController.index);
routes.put('/service-plan/:id', ServicePlanController.update);
routes.delete('/service-plan/:id', ServicePlanController.delete);

export default routes;
