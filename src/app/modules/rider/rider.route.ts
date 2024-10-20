import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from '../user/user.constant';
import { RiderControllers } from './rider.controller';
import { RiderValidations } from './rider.validation';

const router = express.Router();

router
    .route('/')
    .put(
        auth(USER_ROLE.rider),
        validateRequest(RiderValidations.updateRiderValidationSchema),
        RiderControllers.updateRider,
    );

export const RiderRoutes = router;
