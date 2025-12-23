import { Router } from "express";
import { userRoutes } from "../modules/user/user.route.js";
import { authRoutes } from "../modules/auth/auth.route.js";
import { TouristRoutes } from "../modules/tourist/tourist.route.js";
import { TravelRoutes } from "../modules/travel/travel.route.js";
import { joinRoute } from "../modules/join/join.route.js";
import { reviewRoutes } from "../modules/review/review.route.js";
import { paymentRoute } from "../modules/payment/payment.route.js";
import { ChatRoutes } from "../modules/chat/chat.route.js";


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
    },
    {
        path: '/chat',
        route:ChatRoutes
    }
    
];

moduleRoutes.forEach(route => router.use(route.path, route.route))

export default router;