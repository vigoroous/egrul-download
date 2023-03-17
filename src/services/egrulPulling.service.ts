import { first } from "lodash";
import { getSearchRequest, SearchResponse } from "../api/egrul/getSearchRequest";
import { getVypDownloadRequest } from "../api/egrul/getVypDownload";
import { getVypRequest } from "../api/egrul/getVypRequest";
import { getVypStatusRequest } from "../api/egrul/getVypStatusRequest";
import { postInnRequest } from "../api/egrul/postInnRequest";
import { CompanyService } from "../services/company.service";
import { delay } from "../utils";
import { EgrulService } from "./egrul.service";


export class EgrulPullingService {

    static async egrulSearch(innArr: string[], wait?: number, page = 1) {

        if (!!wait) await delay(wait);
        const innRequest = innArr.join(" ");
        const innRes = await postInnRequest(innRequest, page);
        if (!innRes) {
            return;
        };

        if (!!wait) await delay(wait);
        const searchRes = await getSearchRequest(innRes.t);
        if (!searchRes || !searchRes.rows) {
            return;
        }


        const total = Number(first(searchRes.rows)?.tot);
        await this.egrulDownload(searchRes, wait);

        await CompanyService.bulkUpdateCompanyEgrulStatus({
            innArr: innArr,
            isEgrulProcessed: true,
        });

        return { total, page } as const;

    }

    static async egrulDownload (searchRes: SearchResponse, wait?: number) {


        for (const row of searchRes.rows!) {
            const companyInn = row.i;
            const fileHash = row.t;
    
            const egrulData = await EgrulService.createEgrul({
                ...row,
                companyInn: companyInn
            });
            if (!egrulData) {
                continue;
            }
    
            if (!!wait) await delay(wait);
            const vypRes = await getVypRequest(fileHash);
            if (!vypRes) {
                continue;
            }
    
            if (!!wait) await delay(wait);
            const vypStatus = await this.enshureVypStatus(fileHash);
            if (!vypStatus) {
                continue;
            };
    
    
            if (!!wait) await delay(wait);
            const companyName = row.c ?? row.n ?? "undefined";
            const fileName = companyName.replace(/[" ]/g, "_") + `_${companyInn}_${Date.now()}.pdf`;
            await getVypDownloadRequest(fileHash, fileName);
            await EgrulService.updateEgrulIsDownloaded({
                id: egrulData.id,
                isDownloaded: true,
            });
    
        }
    
    }
    
    static async enshureVypStatus (fileHash: string) {
        for (; ;) {
            const vypStatusRes = await getVypStatusRequest(fileHash);
            if (!vypStatusRes) return false;
            if (vypStatusRes.status === 'ready') return true;
    
            await delay(300);
        }
    }
}

