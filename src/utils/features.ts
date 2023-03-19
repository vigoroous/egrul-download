import { chunk } from "lodash";
import { proxies, setAxiosConfig } from "../config/proxies";
import { EgrulPullingService } from "../services/egrulPulling.service";
import { DadataPullingService } from "../services/dadataPulling.service";
import { EgrulService } from "../services/egrul.service";
import { CompanyService } from "../services/company.service";
import { readAllLines, readColumnXlsx } from ".";
import { checkINN } from "ru-validation-codes";

export const runDadata = async () => {
    const unhandledDadataCompanys = await CompanyService.getCompanysUnhandledDadata();
    if (!unhandledDadataCompanys) return;

    for (const { inn } of unhandledDadataCompanys) {
        await DadataPullingService.getSuggestionsByInn(inn);
    }
}

type RunInputType = {
    file: {
        name: string;
        colName?: string;
    };
    type: "xlsx" | "txt";
}

export const runInput = async ({ file, type }: RunInputType) => {

    let inputArr: string[] = [];
    switch (type) {
        case "txt": {
            const arr = readAllLines(file.name);
            inputArr = arr;
            break;
        }
        case "xlsx": {
            const arr = readColumnXlsx(file.name, file.colName ?? "B");
            inputArr = arr;
            break;
        }
    }

    const preparedInnArr = inputArr.flatMap(line => line.split(/[ ;]/g));
    const invalidInnArr: string[] = [];

    for (const inn of preparedInnArr) {
        if (checkINN(inn)) {
            await CompanyService.upsertCompany(inn);
        } else {
            invalidInnArr.push(inn);
        }
    }

    return invalidInnArr;
}


export const runEgrul = async ({ wait, perPage }: { wait: number; perPage: number }) => {
    const unhandledEgrulCompanys = await CompanyService.getCompanysUnhandledEgrul();
    if (!unhandledEgrulCompanys) return;

    const egrulNotDownloaded = await EgrulService.getEgrulNotDownloaded();
    if (!egrulNotDownloaded) return;

    const innArr = egrulNotDownloaded.map((v) => `${v.i} ${v.o}`)
        .concat(unhandledEgrulCompanys.map((v) => v.inn));

    const preparedInnArr = chunk(innArr, perPage);

    for (const item of preparedInnArr) {
        const res = await EgrulPullingService.egrulDownload(item, wait, 1);

        if (!res) continue;

        const pagesCount = Math.ceil(res.total / perPage);
        if (pagesCount > 1) {
            for (let page = 2; page <= pagesCount; page++) {
                await EgrulPullingService.egrulDownload(item, wait, page);
            }
        }
    }
}