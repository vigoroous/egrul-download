import axios from "axios";

type InnResponse = {
    t: string;
    captchaRequired: boolean;
};

export const postInnRequest = async (inn: string) => {
    return await axios<InnResponse>({
        method: "post",
        url: "https://egrul.nalog.ru",
        data: new URLSearchParams({
            query: inn,
        }),
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
}