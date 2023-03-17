import { Dadata } from "@prisma/client";
import logger from "../config/logger";
import { prisma } from "../config/prisma";

export class DadataService {

    static async getDadata(companyInn: string) {
        try {
            const res = await prisma.dadata.findMany({
                where: { companyInn: companyInn },
            });

            logger.info({
                service: "DadataService",
                method: "getDadata",
                params: { companyInn },
                message: !!res
            });
            return res;
        } catch (e) {
            logger.error({
                service: "DadataService",
                method: "getDadata",
                params: { companyInn },
                message: e
            });
            return null;
        }
    }


    static async createDadata(params: Omit<Dadata, "id">) {
        try {
            const res = await prisma.dadata.create({
                data: params
            })
            logger.info({
                service: "DadataService",
                method: "createDadata",
                params,
                message: !!res
            });
            return res;
        } catch (e) {
            logger.error({
                service: "DadataService",
                method: "createDadata",
                params,
                message: e
            });
            return null;
        }
    }

    
}
