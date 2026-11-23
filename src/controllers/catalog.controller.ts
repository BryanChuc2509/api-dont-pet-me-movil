import type { Request, Response } from 'express';
import { z } from 'zod';

import { charactersService } from '../services/characters.service.js';
import { contentService } from '../services/content.service.js';
import { galleryService } from '../services/gallery.service.js';
import { levelsService } from '../services/levels.service.js';

/** ids en minúsculas con guiones: "jaula", "hormiga-reina"... */
const idParam = z.object({ id: z.string().regex(/^[a-z0-9-]{1,64}$/, 'id inválido') });
const galleryQuery = z.object({ levelId: idParam.shape.id.optional() });

/**
 * Controladores delgados: validan la entrada, llaman al servicio y responden.
 * Express 5 propaga los errores async al errorHandler sin try/catch.
 */
export const catalogController = {
  home: async (_req: Request, res: Response) => {
    res.json(await contentService.getHome());
  },

  levels: async (_req: Request, res: Response) => {
    res.json(await levelsService.list());
  },

  level: async (req: Request, res: Response) => {
    const { id } = idParam.parse(req.params);
    res.json(await levelsService.getById(id));
  },

  characters: async (_req: Request, res: Response) => {
    res.json(await charactersService.list());
  },

  character: async (req: Request, res: Response) => {
    const { id } = idParam.parse(req.params);
    res.json(await charactersService.getById(id));
  },

  gallery: async (req: Request, res: Response) => {
    const { levelId } = galleryQuery.parse(req.query);
    res.json(await galleryService.list(levelId));
  },

  gameplay: async (_req: Request, res: Response) => {
    res.json(await contentService.getGameplay());
  },
};
