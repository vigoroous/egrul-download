import axios from "axios";
import logger from "../../config/logger";

type VypResponse = {
    t: string;
    captchaRequired: boolean;
};

export const getVypRequest = async (token: string) => {
    try {
        const timestamp = Date.now();

        const res = await axios<VypResponse>({
            method: "get",
            url: `https://egrul.nalog.ru/vyp-request/${token}?r=&_=${timestamp}`,
        });

        logger.info({
            context: "getVypRequest",
            params: {
                token,
            },
            message: res.data
        });

        return res.data;
    } catch (e) {
        logger.error({
            context: "getVypRequest",
            params: {
                token,
            },
            message: e
        });

        return null;
    }
};