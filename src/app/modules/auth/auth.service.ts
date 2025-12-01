import { id } from "zod/v4/locales";
import ApiError from "../../error/appError";
import { jwtHelper } from "../../helper/jwtHelper";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";

const login = async (payload: { email: string, password: string }) => {
    const user = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
    
        }
    })

    const isCorrectPassword = await bcrypt.compare(payload.password, user.password);
    if (!isCorrectPassword) {
        throw new ApiError(401, "Password is incorrect!")
    }

    const accessToken = jwtHelper.generateToken({id: user.id, email: user.email, role: user.role }, "abcd", "1h");

    const refreshToken = jwtHelper.generateToken({ id: user.id, email: user.email, role: user.role }, "abcdefgh", "90d");

    return {
        accessToken,
        refreshToken,
      
    }
}

export const AuthService = {
    login
}