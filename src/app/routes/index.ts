import { Router } from "express";
import { userRoutes } from "../modules/user/user.route";
import { authRoutes } from "../modules/auth/auth.route";
import { TouristRoutes } from "../modules/tourist/tourist.route";
import { TravelRoutes } from "../modules/travel/travel.route";

import { reviewRoutes } from "../modules/review/review.route";
import { paymentRoute } from "../modules/payment/payment.route";
import { joinRoute } from "../modules/join/join.route";

const router = Router();

const moduleRoutes = [
    {
        path: '/user',
        route: userRoutes
    },
    {
        path: '/auth',
        route: authRoutes
    },
    {
        path:'/tourist',
        route: TouristRoutes
    },
    {
        path: '/travel',
        route:TravelRoutes
    },
    {
        path: '/join',
        route: joinRoute
    },
    {
        path: '/review',
        route: reviewRoutes
    },
    {
        path: '/payment',
        route: paymentRoute
    }
    
];

moduleRoutes.forEach(route => router.use(route.path, route.route))

export default router;