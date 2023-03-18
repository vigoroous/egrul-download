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

    static async updateCompanyDadataStatus(
        params: UpdateCompanyDadataStatusType
    ) {
        try {
            const res = await prisma.company.update({
                where: { inn: params.inn },
                data: { isDadataProcessed: params.isDadataProcessed },
            })
            logger.info({
                service: "CompanyService",
                method: "updateCompanyDadataStatus",
                params,
                message: res
            });
            return res;
        } catch (e) {
            logger.error({
                service: "CompanyService",
                method: "updateCompanyDadataStatus",
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

    static async getCompanysUnhandledEgrul() {
        try {
            const res = await prisma.company.findMany({
                where: { isEgrulProcessed: false },
            });
            logger.info({
                service: "CompanyService",
                method: "getCompanysUnhandledEgrul",
                message: res,
            });
            return res;
        } catch (e) {
            logger.error({
                service: "CompanyService",
                method: "getCompanysUnhandledEgrul",
                message: e,
            });
            return null;
        }
    }

    static async getCompanysUnhandledDadata() {
        try {
            const res = await prisma.company.findMany({
                where: { isDadataProcessed: false },
            });
            logger.info({
                service: "CompanyService",
                method: "getCompanysUnhandledDadata",
                message: res,
            });
            return res;
        } catch (e) {
            logger.error({
                service: "CompanyService",
                method: "getCompanysUnhandledDadata",
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

type UpdateCompanyDadataStatusType = {
    inn: string;
    isDadataProcessed: boolean;
}