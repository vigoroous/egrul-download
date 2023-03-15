import { getSearchRequest } from "../api/getSearchRequest";
import { getVypDownloadRequest } from "../api/getVypDownload";
import { getVypRequest } from "../api/getVypRequest";
import { getVypStatusRequest } from "../api/getVypStatusRequest";
import { postInnRequest } from "../api/postInnRequest";
import logger from "../config/logger";
import { delay } from "../utils";
import { upsertCompanyDetails } from "./companyDetailsHandler";
import { CompanyStatus, createCompany, getCompanyByInn, updateCompanyStatus } from "./companyHandler";


export const downloadHandler = async (innArray: string[]) => {
    // logger.warn({ context: "downloadHandler", message: innArray });
    const innsToProcces: string[] = [];

    for (const inn of innArray) {
        const res = await getCompanyByInn(inn);
        if (!res) {
            await createCompany(inn);
            innsToProcces.push(inn);
        } else if (
            res.status === CompanyStatus.ERROR ||
            res.status === CompanyStatus.NOT_EXECUTED
        ) {
            innsToProcces.push(inn);
        }
    }
    // logger.warn({ context: "downloadHandler", message: innArray });

    const innRequest = innsToProcces.join(" ")
    const innRes = await postInnRequest(innRequest);
    if (!innRes) {
        for (const inn of innsToProcces) {
            await updateCompanyStatus({ inn, status: CompanyStatus.ERROR });
        }
        return;
    };

    const searchRes = await getSearchRequest(innRes.t);
    if (!searchRes) {
        for (const inn of innsToProcces) {
            await updateCompanyStatus({ inn, status: CompanyStatus.ERROR });
        }
        return;
    }

    const foundInns: string[] = [];

    for (const companyDetails of searchRes.rows) {
        const companyInn = companyDetails.i

        await upsertCompanyDetails({ ...companyDetails, companyInn: companyInn });

        foundInns.push(companyInn);
        // if (innArray.includes(companyInn)) {
        //     await updateCompanyStatus({ inn: companyInn, status: CompanyStatus.FOUND });
        // } else {
        //     await updateCompanyStatus({ inn: companyInn, status: CompanyStatus.NOT_FOUND });
        // }

        const fileHash = companyDetails.t;

        const vypRes = await getVypRequest(fileHash);
        if (!vypRes) {
            await updateCompanyStatus({ inn: companyInn, status: CompanyStatus.ERROR });
        } else {


            let status: "wait" | "ready" | undefined;

            while (status !== "ready") {
                const vypStatusRes = await getVypStatusRequest(fileHash);
                if (!vypStatusRes) {
                    await updateCompanyStatus({ inn: companyInn, status: CompanyStatus.ERROR });
                    break;
                }

                status = vypStatusRes.status;
                await delay(300);
            }
        }

        const companyName = companyDetails.c ?? companyDetails.n ?? "undefined";

        const fileName = companyName.replace(/[" ]/g, "_") + `_${companyInn}.pdf`;
        await getVypDownloadRequest(fileHash, fileName);

        await updateCompanyStatus({ inn: companyInn, status: CompanyStatus.OK });
    }

    for (const inn of innsToProcces) {

        if (!foundInns.includes(inn)) {
            await updateCompanyStatus({ inn: inn, status: CompanyStatus.NOT_FOUND });
        }
    }

    // if (searchRes.rows.length !== innArray.length) {
    //     const found = innArray.filter((inn) => searchRes.rows.includes({i}));


    // }


}
