
import { Prisma, Tourist } from "@prisma/client";
import { IOptions, paginationHelper } from "../../helper/pagination.js";
import { prisma } from "../../lib/prisma.js";
import { touristSearchableFields } from "./tourist.constant.js";
import { ITouristFilter } from "./tourist.interface.js";

const getAllFromDB = async (
    filters: ITouristFilter,
    options: IOptions,
) => {
    const { limit, page, skip } = paginationHelper.calculatePagination(options);
    const { searchTerm, ...filterData } = filters;

    const andConditions: Prisma.TouristWhereInput[] = [];

    if (searchTerm) {
        andConditions.push({
            OR: touristSearchableFields.map(field => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
            })),
        } as Prisma.TouristWhereInput);
    }

    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map(key => {
                return {
                    [key]: {
                        equals: (filterData as any)[key],
                    },
                };
            }),
        } as Prisma.TouristWhereInput);
    }
    andConditions.push({
        isDeleted: false,
    } as Prisma.TouristWhereInput);

    const whereConditions: Prisma.TouristWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.tourist.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy:
            options.sortBy && options.sortOrder
                ? { [options.sortBy]: options.sortOrder }
                : {
                    created_at: 'desc',
                }
    });
    const total = await prisma.tourist.count({
        where: whereConditions,
    });

    return {
        meta: {
            total,
            page,
            limit,
        },
        data: result,
    };
};

const getByIdFromDB = async (id: string): Promise<Tourist| null> => {
    const result = await prisma.tourist.findUnique({
        where: {
            id,
            isDeleted: false,
        },
    });
    return result;
};


const deleteTourist= async (id: string): Promise<Tourist | null> => {
    const deletedTourist = await prisma.tourist.delete({
        where: { id },
    });


    return deletedTourist;  
   
}



// const softDelete = async (id: string): Promise<Tourist | null> => {
//     return await prisma.$transaction(async transactionClient => {
//         const deletedTourist = await transactionClient.tourist.update({
//             where: { id },
//             data: {
//                 isDeleted: true,
//             },
//         });

//         await transactionClient.user.update({
//             where: {
//                 email: deletedTourist.user. email,
//             },
//             data: {
//                 status: UserStatus.DELETED,
//             },
//         });

//         return deletedTourist;
//     });
// };

export const TouristService = {
    getAllFromDB,
    getByIdFromDB,
    deleteTourist,
    // softDelete,
};