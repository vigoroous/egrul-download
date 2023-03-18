import { Dadata } from "@prisma/client";
import logger from "../config/logger";
import { prisma } from "../config/prisma";

export class DadataService {

    static async upsertDadata(params: Dadata) {
        try {
            const res = await prisma.dadata.upsert({
                where: {
                    inn_ogrn: {
                        inn: params.inn,
                        ogrn: params.ogrn,
                    },
                },
                update: params,
                create: params,
            })
            logger.info({
                service: "DadataService",
                method: "upsertDadata",
                params,
                message: res
            });
            return res;
        } catch (e) {
            logger.error({
                service: "DadataService",
                method: "upsertDadata",
                params,
                message: e
            });
            return null;
        }
    }

}
