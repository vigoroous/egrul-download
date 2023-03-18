import { Dadata } from "@prisma/client";
import logger from "../config/logger";
import { prisma } from "../config/prisma";

export class DadataService {

    // static async getDadata(companyInn: string) {
    //     try {
    //         const res = await prisma.dadata.findUnique({
    //             where: { inn_ogrn: {inn: } },
    //         });

    //         logger.info({
    //             service: "DadataService",
    //             method: "getDadata",
    //             params: { companyInn },
    //             message: !!res
    //         });
    //         return res;
    //     } catch (e) {
    //         logger.error({
    //             service: "DadataService",
    //             method: "getDadata",
    //             params: { companyInn },
    //             message: e
    //         });
    //         return null;
    //     }
    // }


    static async upsertDadata(params: Dadata) {
        try {
            const res = await prisma.dadata.upsert({
                where: { i_ogrn: { i: params.i, ogrn: params.ogrn } },
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
