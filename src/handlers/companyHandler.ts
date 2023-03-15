import logger from "../config/logger";
import { prisma } from "../config/prisma";

export const getCompanyByInn = async (inn: string) => {
    try {
        const res = await prisma.company.findUnique({
            where: { inn },
        });

        logger.info({
            context: "getCompanyByInn",
            params: {
                inn,
            },
            message: res
        });
        return res;
    } catch (e) {
        logger.error({
            context: "getCompanyByInn",
            params: {
                inn,
            },
            message: e
        });
        return null;
    }
}


export const createCompany = async (inn: string) => {
    try {
        const res = await prisma.company.create({
            data: { inn: inn },
        })
        logger.info({
            context: "createCompany",
            params: { inn },
            message: res
        });
        return res;
    } catch (e) {
        logger.error({
            context: "createCompany",
            params: { inn },
            message: e
        });
        return null;
    }
}

type UpdateCompanyStatusType = {
    inn: string,
    status: CompanyStatus,
}

export enum CompanyStatus {
    NOT_EXECUTED,
    OK,
    ERROR,
    NOT_FOUND,
}

export const updateCompanyStatus = async (params: UpdateCompanyStatusType) => {
    try {
        const res = await prisma.company.update({
            where: { inn: params.inn },
            data: { status: params.status },
        })
        logger.info({
            context: "updateCompanyStatus",
            params,
            message: res
        });
        return res;
    } catch (e) {
        logger.error({
            context: "updateCompanyStatus",
            params,
            message: e
        });
        return null;
    }
}

export const deleteCompany = async (inn: string) => {
    try {
        const res = await prisma.company.delete({
            where: { inn },
        });
        logger.info({
            context: "deleteCompany",
            params: { inn },
            message: res
        });
        return res;
    } catch (e) {
        logger.error({
            context: "deleteCompany",
            params: { inn },
            message: e
        });
        return null;
    }
}

export const getUnhandledCompanies = async () => {
    try {
        const res = await prisma.company.findMany({
            where: {
                status: {
                    in: [
                        CompanyStatus.ERROR,
                        CompanyStatus.NOT_EXECUTED
                    ],
                },
            },
        });
        logger.info({
            context: "getUnhandledCompanies",
            message: res,
        });
        return res;
    } catch (e) {
        logger.error({
            context: "getUnhandledCompanies",
            message: e,
        });
        return null;
    }
}