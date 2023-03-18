import { first } from "lodash";
import { getSearchRequest, SearchResponse } from "../api/egrul/getSearchRequest";
import { getVypDownloadRequest } from "../api/egrul/getVypDownload";
import { getVypRequest } from "../api/egrul/getVypRequest";
import { getVypStatusRequest } from "../api/egrul/getVypStatusRequest";
import { postInnRequest } from "../api/egrul/postInnRequest";
import { CompanyService } from "../services/company.service";
import { delay } from "../utils";
import { EgrulService } from "./egrul.service";


// TODO: restart failed download without creating new Egrul dump

export class EgrulPullingService {

    static async egrulDownload(innArr: string[], wait?: number, page = 1) {

        if (wait) await delay(wait);
        const innRequest = innArr.join(" ");
        const innRes = await postInnRequest(innRequest, page);
        if (!innRes) {
            return;
        };

        if (wait) await delay(wait);
        const searchRes = await getSearchRequest(innRes.t);
        if (!searchRes || !searchRes.rows) {
            return;
        }

        for (const row of searchRes.rows!) {

            const egrulData = await EgrulService.upsertEgrul(row);
            if (!egrulData) continue;

            if (wait) await delay(wait);
            const vypRes = await getVypRequest(row.t);
            if (!vypRes) continue;

            if (wait) await delay(wait);
            const vypStatus = await this.enshureVypStatus(row.t, wait);
            if (!vypStatus) continue;



            if (wait) await delay(wait);
            const companyName = row.c ?? row.n ?? "undefined";
            const fileName = companyName.replace(/[" ]/g, "_") + `_${row.i}_${row.o}.pdf`;
            await getVypDownloadRequest(row.t, fileName);

            await EgrulService.updateEgrulIsDownloaded({
                inn: egrulData.i,
                ogrn: egrulData.o,
                isDownloaded: true,
            });
        }

        await CompanyService.bulkUpdateCompanyEgrulStatus({
            innArr: innArr,
            isEgrulProcessed: true,
        });

        return { total: Number(first(searchRes.rows)?.tot) } as const;
    }

    static async enshureVypStatus(fileHash: string, wait?: number) {
        for (; ;) {
            const vypStatusRes = await getVypStatusRequest(fileHash);
            if (!vypStatusRes) return false;
            if (vypStatusRes.status === 'ready') return true;

            if (wait) await delay(wait);
        }
    }

}

