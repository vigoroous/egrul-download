import axios from "axios";

type VypStatusResponse = {
    status: "wait" | "ready";
};

export const getVypStatusRequest = async (token: string) => {
    const timestamp = Date.now();

    return await axios<VypStatusResponse>({
        method: "get",
        url: `https://egrul.nalog.ru/vyp-status/${token}?r=${timestamp}&_=${timestamp}`,
    });
}