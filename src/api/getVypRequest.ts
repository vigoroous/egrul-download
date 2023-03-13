import axios from "axios";

type VypResponse = {
    t: string;
    captchaRequired: boolean;
};

export const getVypRequest = async (token: string) => {
    const timestamp = Date.now();

    return await axios<VypResponse>({
        method: "get",
        url: `https://egrul.nalog.ru/vyp-request/${token}?r=&_=${timestamp}`,
    });

};