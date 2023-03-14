import axios from "axios";
import logger from "../config/logger";

type InnResponse = {
    t: string;
    captchaRequired: boolean;
};

export const postInnRequest = async (inn: string) => {
    try {
        const res = await axios<InnResponse>({
            method: "post",
            url: "https://egrul.nalog.ru",
            data: new URLSearchParams({
                query: inn,
            }),
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });

        logger.info({
            context: "postInnRequest",
            params: {
                inn,
            },
            message: res.data
        });

        return res.data;

    } catch (e) {
        logger.error({
            context: "postInnRequest",
            params: {
                inn,
            },
            message: e
        });

        return null;
    }
}