import express from 'express';
import { createStoppageController, getAllStoppageController, stoppageByIdController, updateStoppageController, deleteStoppageController} from '../controllers/stoppage.controller';
import { validateRequest } from '@middleware/validateRequest';
import { createStoppageBodySchema, stoppageFilterQuerySchema, updateStoppageBodySchema, updateStoppageParamsSchema, deleteStoppageParamsSchema,
	getStoppageParamsSchema
} from '../validations/stoppage.schema';

const stoppageRouter = express.Router();

stoppageRouter.post('/createStoppage', validateRequest(createStoppageBodySchema, "body"), createStoppageController);
stoppageRouter.get('/allStoppages', validateRequest(stoppageFilterQuerySchema, "query"), getAllStoppageController);
stoppageRouter.get('/stoppageById/:id', validateRequest(getStoppageParamsSchema, "params"), stoppageByIdController);

stoppageRouter.put('/stoppageUpdate/:id', 
	validateRequest(updateStoppageParamsSchema, "params"), 
	validateRequest(updateStoppageBodySchema, "body"), 
	updateStoppageController);

stoppageRouter.patch('/deleteStoppage/:id', validateRequest(deleteStoppageParamsSchema, "params"), deleteStoppageController);


export default stoppageRouter;
