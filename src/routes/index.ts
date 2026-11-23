import { Router } from 'express';

import { catalogController as c } from '../controllers/catalog.controller.js';
import { cacheControl } from '../middlewares/cache.js';

/** Rutas públicas de solo lectura: /api/v1/... */
export const apiRouter = Router();

apiRouter.use(cacheControl);

apiRouter.get('/home', c.home);
apiRouter.get('/levels', c.levels);
apiRouter.get('/levels/:id', c.level);
apiRouter.get('/characters', c.characters);
apiRouter.get('/characters/:id', c.character);
apiRouter.get('/gallery', c.gallery);
apiRouter.get('/gameplay', c.gameplay);
