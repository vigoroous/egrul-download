import { CompanyDetails } from "@prisma/client";
import logger from "../config/logger";
import { prisma } from "../config/prisma";

export const getCompanyDetails = async (companyInn: string) => {
    try {
        const res = await prisma.companyDetails.findUnique({
            where: { companyInn: companyInn },
        });

        logger.info({
            context: "getCompanyDetails",
            params: { companyInn },
            message: res
        });
        return res;
    } catch (e) {
        logger.error({
            context: "getCompanyDetails",
            params: { companyInn },
            message: e
        });
        return null;
    }
}


export const upsertCompanyDetails = async (params: Omit<CompanyDetails, "id">) => {
    try {
        const res = await prisma.companyDetails.upsert({
            where: {
                companyInn: params.companyInn,
            },
            create: params,
            update: params,
        })
        logger.info({
            context: "upsertCompanyDetails",
            params,
            message: res
        });
        return res;
    } catch (e) {
        logger.error({
            context: "upsertCompanyDetails",
            params,
            message: e
        });
        return null;
    }
}