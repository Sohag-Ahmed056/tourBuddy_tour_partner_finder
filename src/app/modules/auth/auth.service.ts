
import ApiError from "../../error/appError.js";
import { jwtHelper } from "../../helper/jwtHelper.js";
import { prisma } from "../../lib/prisma.js";
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

const changePassword = async(userId:string, oldPassword:string, newPassword:string)=>{
    const user = await prisma.user.findUniqueOrThrow({
        where:{
            id:userId
        }
    });

    const isPasswordMatched = await bcrypt.compare(oldPassword, user.password);
    if(!isPasswordMatched){
        throw new ApiError(401, "Old password is incorrect!");
    }

    const hashedNewPassword = await bcrypt.hash(newPassword,10);

    await prisma.user.update({
        where:{
            id:userId
        },
        data:{
            password:hashedNewPassword
        }
    });

}

export const AuthService = {
    login,
    changePassword
}