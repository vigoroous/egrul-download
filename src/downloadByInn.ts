import { getSearchRequest } from "./api/getSearchRequest";
import { getVypDownloadRequest } from "./api/getVypDownload";
import { getVypRequest } from "./api/getVypRequest";
import { getVypStatusRequest } from "./api/getVypStatusRequest";
import { postInnRequest } from "./api/postInnRequest";
import { delay } from "./utils";

export const downloadByInn = async (inn: string) => {
    const innRes = await postInnRequest(inn);
    if (!innRes) return false;

    const searchRes = await getSearchRequest(innRes.t);
    if (!searchRes) return false;
    const fileHash = searchRes.rows[0].t;

    const vypRes = await getVypRequest(fileHash);
    if (!vypRes) return false;


    let status: "wait" | "ready" | undefined;

    while (status !== "ready") {
        const vypStatusRes = await getVypStatusRequest(fileHash);
        if (!vypStatusRes) return false;

        status = vypStatusRes.status;
        await delay(300);
    }

    const fileName = searchRes.rows[0].c.replace(/[" ]/g, "_") + inn + ".pdf";
    await getVypDownloadRequest(fileHash, fileName);

    console.log("OK");

    return true;
}