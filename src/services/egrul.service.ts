import { Egrul } from "@prisma/client";
import logger from "../config/logger";
import { prisma } from "../config/prisma";

export class EgrulService {

    static async getEgrul(companyInn: string) {
        try {
            const res = await prisma.egrul.findMany({
                where: { companyInn: companyInn },
            });

            logger.info({
                service: "EgrulService",
                method: "getEgrul",
                params: { companyInn },
                message: res
            });
            return res;
        } catch (e) {
            logger.error({
                service: "EgrulService",
                method: "getEgrul",
                params: { companyInn },
                message: e
            });
            return null;
        }
    }


    static async createEgrul(params: Omit<Egrul, "id" | "isDownloaded">) {
        try {
            const res = await prisma.egrul.create({
                data: params
            })
            logger.info({
                service: "EgrulService",
                method: "createEgrul",
                params,
                message: res
            });
            return res;
        } catch (e) {
            logger.error({
                service: "EgrulService",
                method: "createEgrul",
                params,
                message: e
            });
            return null;
        }
    }

    static async updateEgrulIsDownloaded(params: UpdateEgrulIsDownloadedType) {
        try {
            const res = await prisma.egrul.update({
                where: { id: params.id },
                data: { isDownloaded: params.isDownloaded }
            });

            logger.info({
                service: "EgrulService",
                method: "updateEgrulIsDownloaded",
                params,
                message: res
            });
            return res;
        } catch (e) {
            logger.error({
                service: "EgrulService",
                method: "updateEgrulIsDownloaded",
                params,
                message: e
            });
            return null;
        }
    }
}

type UpdateEgrulIsDownloadedType = {
    id: number,
    isDownloaded: boolean
}
