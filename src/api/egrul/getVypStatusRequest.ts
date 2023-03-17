import axios from "axios";
import logger from "../../config/logger";

type VypStatusResponse = {
    status: "wait" | "ready";
};

export const getVypStatusRequest = async (token: string) => {
    try {
        const timestamp = Date.now();

        const res = await axios<VypStatusResponse>({
            method: "get",
            url: `https://egrul.nalog.ru/vyp-status/${token}?r=${timestamp}&_=${timestamp}`,
        });

        logger.info({
            context: "getVypStatusRequest",
            params: {
                token,
            },
            message: res.data
        });

        return res.data;
    } catch (e) {
        logger.error({
            context: "getVypStatusRequest",
            params: {
                token,
            },
            message: e
        });

        return null;
    }
}