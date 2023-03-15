import { difference, map } from "lodash";
import { getSearchRequest } from "../api/getSearchRequest";
import { getVypDownloadRequest } from "../api/getVypDownload";
import { getVypRequest } from "../api/getVypRequest";
import { getVypStatusRequest } from "../api/getVypStatusRequest";
import { postInnRequest } from "../api/postInnRequest";
import { delay } from "../utils";
import { upsertCompanyDetails } from "./companyDetailsHandler";
import { bulkUpdateCompanyStatus, CompanyStatus, updateCompanyStatus } from "./companyHandler";


export const downloadHandler = async (innArr: string[]): Promise<boolean> => {

    const innRequest = innArr.join(" ");
    const innRes = await postInnRequest(innRequest);
    if (!innRes) {
        await bulkUpdateCompanyStatus({ innArr: innArr, status: CompanyStatus.ERROR });
        return false;
    };

    const searchRes = await getSearchRequest(innRes.t);
    if (!searchRes || !searchRes.rows) {
        await bulkUpdateCompanyStatus({ innArr: innArr, status: CompanyStatus.ERROR });
        return false;
    }

    const notFoundInnArr = difference(innArr, map(searchRes.rows, "i"));
    if (notFoundInnArr.length > 0) {
        await bulkUpdateCompanyStatus({ innArr: notFoundInnArr, status: CompanyStatus.NOT_FOUND });
    }

    for (const companyDetails of searchRes.rows) {
        const companyInn = companyDetails.i;
        const fileHash = companyDetails.t;

        await upsertCompanyDetails({ ...companyDetails, companyInn: companyInn });

        const vypRes = await getVypRequest(fileHash);
        if (!vypRes) {
            await updateCompanyStatus({ inn: companyInn, status: CompanyStatus.ERROR });
            continue;
        }

        const vypStatus = await enshureVypStatus(fileHash);
        if (!vypStatus) {
            await updateCompanyStatus({ inn: companyInn, status: CompanyStatus.ERROR });
            continue;
        };

        const companyName = companyDetails.c ?? companyDetails.n ?? "undefined";
        const fileName = companyName.replace(/[" ]/g, "_") + `_${companyInn}.pdf`;
        await getVypDownloadRequest(fileHash, fileName);
        await updateCompanyStatus({ inn: companyInn, status: CompanyStatus.OK });

    }

    return true;
}

const enshureVypStatus = async (fileHash: string) => {
    for (; ;) {
        const vypStatusRes = await getVypStatusRequest(fileHash);
        if (!vypStatusRes) return false;
        if (vypStatusRes.status === 'ready') return true;

        await delay(300);
    }
}
