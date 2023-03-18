import { Egrul } from "@prisma/client";
import logger from "../config/logger";
import { prisma } from "../config/prisma";

export class EgrulService {

    static async getEgrulByInnOgrn(params: GetEgrulByInnOgrn) {
        try {
            const res = await prisma.egrul.findMany({
                where: {
                    companyInn: params.inn,
                    o: params.ogrn
                },
            });

            logger.info({
                service: "EgrulService",
                method: "getEgrul",
                params,
                message: res
            });
            return res;
        } catch (e) {
            logger.error({
                service: "EgrulService",
                method: "getEgrul",
                params,
                message: e
            });
            return null;
        }
    }

    static async getNotDownloadedEgrul() {
        try {
            const res = await prisma.egrul.findMany({
                where: { isDownloaded: false },
            });

            logger.info({
                service: "EgrulService",
                method: "getNotDownloadedEgrul",
                message: res
            });
            return res;
        } catch (e) {
            logger.error({
                service: "EgrulService",
                method: "getNotDownloadedEgrul",
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
    id: number;
    isDownloaded: boolean;
}


type GetEgrulByInnOgrn = {
    inn: string;
    ogrn: string;
}