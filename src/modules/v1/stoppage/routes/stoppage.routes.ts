import express from 'express';
import { createStoppageController, getAllStoppageController} from '../controllers/stoppage.controller';
import { validateRequest } from '@middleware/validateRequest';
import { createStoppageBodySchema, stoppageFilterQuerySchema, updateStoppageBodySchema, updateStoppageParamsSchema, deleteStoppageParamsSchema,
	getStoppageParamsSchema
} from '../validations/stoppage.schema';

const stoppageRouter = express.Router();

stoppageRouter.post('/createStoppage', validateRequest(createStoppageBodySchema, "body"), createStoppageController);
stoppageRouter.get('/allStoppages', validateRequest(stoppageFilterQuerySchema, "query"), getAllStoppageController);
stoppageRouter.get('/stoppageById/:id', validateRequest(getStoppageParamsSchema, "params"), );

stoppageRouter.put('/stoppageUpdate/:id', 
	validateRequest(updateStoppageParamsSchema, "params"), 
	validateRequest(updateStoppageBodySchema, "body"), 
	getAllStoppageController);

stoppageRouter.patch('/deleteStoppage/:id', validateRequest(deleteStoppageParamsSchema, "query"), getAllStoppageController);


export default stoppageRouter;
