import logger from "../config/logger";
import { prisma } from "../config/prisma";

export class CompanyService {

    static async getCompanyByInn(inn: string) {
        try {
            const res = await prisma.company.findUnique({
                where: { inn },
            });

            logger.info({
                service: "CompanyService",
                method: "getCompanyByInn",
                params: { inn },
                message: res
            });
            return res;
        } catch (e) {
            logger.error({
                service: "CompanyService",
                method: "getCompanyByInn",
                params: { inn },
                message: e
            });
            return null;
        }
    }

    static async createCompany(inn: string) {
        try {
            const res = await prisma.company.create({
                data: { inn: inn },
            })
            logger.info({
                service: "CompanyService",
                method: "createCompany",
                params: { inn },
                message: res
            });
            return res;
        } catch (e) {
            logger.error({
                service: "CompanyService",
                method: "createCompany",
                params: { inn },
                message: e
            });
            return null;
        }
    }

    static async bulkUpdateCompanyEgrulStatus(
        params: BulkUpdateCompanyEgrulStatusType
    ) {
        try {
            const res = await prisma.company.updateMany({
                where: { inn: { in: params.innArr } },
                data: { isEgrulProcessed: params.isEgrulProcessed },
            })
            logger.info({
                service: "CompanyService",
                method: "bulkUpdateCompanyStatus",
                params,
                message: res
            });
            return res;
        } catch (e) {
            logger.error({
                service: "CompanyService",
                method: "bulkUpdateCompanyStatus",
                params,
                message: e
            });
            return null;
        }
    }

    static async bulkUpdateCompanyDadataStatus(
        params: BulkUpdateCompanyDadataStatusType
    ) {
        try {
            const res = await prisma.company.updateMany({
                where: { inn: { in: params.innArr } },
                data: { isDadataProcessed: params.isDadataProcessed },
            })
            logger.info({
                service: "CompanyService",
                method: "bulkUpdateCompanyStatus",
                params,
                message: res
            });
            return res;
        } catch (e) {
            logger.error({
                service: "CompanyService",
                method: "bulkUpdateCompanyStatus",
                params,
                message: e
            });
            return null;
        }
    }

    static async deleteCompany(inn: string) {
        try {
            const res = await prisma.company.delete({
                where: { inn },
            });
            logger.info({
                service: "CompanyService",
                method: "deleteCompany",
                params: { inn },
                message: res
            });
            return res;
        } catch (e) {
            logger.error({
                service: "CompanyService",
                method: "deleteCompany",
                params: { inn },
                message: e
            });
            return null;
        }
    }

    static async getUnhandledEgrulCompanys() {
        try {
            const res = await prisma.company.findMany({
                where: { isEgrulProcessed: false },
            });
            logger.info({
                service: "CompanyService",
                method: "getUnhandledCompanys",
                message: res,
            });
            return res;
        } catch (e) {
            logger.error({
                service: "CompanyService",
                method: "getUnhandledCompanys",
                message: e,
            });
            return null;
        }
    }

    static async getUnhandledDadataCompanys() {
        try {
            const res = await prisma.company.findMany({
                where: { isDadataProcessed: false },
            });
            logger.info({
                service: "CompanyService",
                method: "getUnhandledCompanys",
                message: res,
            });
            return res;
        } catch (e) {
            logger.error({
                service: "CompanyService",
                method: "getUnhandledCompanys",
                message: e,
            });
            return null;
        }
    }

    static async upsertCompany(inn: string) {
        try {
            const res = await prisma.company.upsert({
                where: { inn: inn },
                update: {},
                create: { inn: inn },
            });
            logger.info({
                service: "CompanyService",
                method: "upsertCompany",
                message: res,
            });
            return res;
        } catch (e) {
            logger.error({
                service: "CompanyService",
                method: "upsertCompany",
                message: e,
            });
            return null;
        }
    }

}


type BulkUpdateCompanyEgrulStatusType = {
    innArr: string[];
    isEgrulProcessed: boolean;
}

type BulkUpdateCompanyDadataStatusType = {
    innArr: string[];
    isDadataProcessed: boolean;
}