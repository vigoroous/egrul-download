import axios from "axios";
import logger from "../../config/logger";

type InnResponse = {
    t: string;
    captchaRequired: boolean;
};

export const postInnRequest = async (query: string, page?: number) => {
    try {
        const res = await axios<InnResponse>({
            method: "post",
            url: "https://egrul.nalog.ru",
            data: new URLSearchParams({
                query: query,
                page: page ? page.toString() : "",
            }),
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });

        logger.info({
            context: "postInnRequest",
            params: {
                query,
                page,
            },
            message: res.data
        });

        return res.data;

    } catch (e) {
        logger.error({
            context: "postInnRequest",
            params: {
                query,
                page,
            },
            message: e
        });

        return null;
    }
}