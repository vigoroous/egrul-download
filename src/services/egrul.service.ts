import { Egrul } from "@prisma/client";
import logger from "../config/logger";
import { prisma } from "../config/prisma";

export class EgrulService {

    static async getEgrulByInnOgrn(params: GetEgrulByInnOgrn) {
        try {
            const res = await prisma.egrul.findUnique({
                where: { i_o: { i: params.inn, o: params.ogrn } },
            });

            logger.info({
                service: "EgrulService",
                method: "getEgrulByInnOgrn",
                params,
                message: res
            });
            return res;
        } catch (e) {
            logger.error({
                service: "EgrulService",
                method: "getEgrulByInnOgrn",
                params,
                message: e
            });
            return null;
        }
    }

    static async getEgrulNotDownloaded() {
        try {
            const res = await prisma.egrul.findMany({
                where: { isDownloaded: false },
            });

            logger.info({
                service: "EgrulService",
                method: "getEgrulNotDownloaded",
                message: res
            });
            return res;
        } catch (e) {
            logger.error({
                service: "EgrulService",
                method: "getEgrulNotDownloaded",
                message: e
            });
            return null;
        }
    }


    static async upsertEgrul(params: Omit<Egrul, "isDownloaded">) {
        try {
            const res = await prisma.egrul.upsert({
                where: { i_o: { i: params.i, o: params.o } },
                update: params,
                create: params,
            })
            logger.info({
                service: "EgrulService",
                method: "upsertEgrul",
                params,
                message: res
            });
            return res;
        } catch (e) {
            logger.error({
                service: "EgrulService",
                method: "upsertEgrul",
                params,
                message: e
            });
            return null;
        }
    }

    static async updateEgrulIsDownloaded(params: UpdateEgrulIsDownloadedType) {
        try {
            const res = await prisma.egrul.update({
                where: { i_o: { i: params.inn, o: params.ogrn } },
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
    inn: string;
    ogrn: string;
    isDownloaded: boolean;
}


type GetEgrulByInnOgrn = {
    inn: string;
    ogrn: string;
}