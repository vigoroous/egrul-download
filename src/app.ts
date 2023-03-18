import { chunk } from "lodash";
import { proxies, setAxiosConfig } from "./config/proxies";
import { CompanyService } from "./services/company.service";
import { createReportXslx, delay, readAllLines, readColumnXlsx } from "./utils";
import { EgrulPullingService } from "./services/egrulPulling.service";
import { DadataPullingService } from "./services/dadataPulling.service";
import { EgrulService } from "./services/egrul.service";


const options = {
    useInput: false,
    useEgrul: false,
    useDadata: false,
    createReport: true,
    perPage: 20,
    wait: 300,
}

const main = async () => {
    const { createReport, perPage, useDadata, useEgrul, wait, useInput } = options;

    if (useInput) await runInput();

    if (useEgrul) await runEgrul({ wait, perPage });

    if (useDadata) await runDadata();

    if(createReport) await createReportXslx();


}


main();

const runDadata = async () => {
    const unhandledDadataCompanys = await CompanyService.getCompanysUnhandledDadata();
    if (!unhandledDadataCompanys) return;

    for (const { inn } of unhandledDadataCompanys) {
        await DadataPullingService.getSuggestionsByInn(inn);
    }
}

const runInput = async () => {
    const inputInnArr = readColumnXlsx("data/input.xlsx", "B");
    const inputInnArr2 = readAllLines("data/input.txt");
    const inputInnArr3 = inputInnArr.concat(inputInnArr2);

    for (const inn of inputInnArr3.flatMap(line => line.split(" "))) {
        await CompanyService.upsertCompany(inn);
    }
}


const runEgrul = async ({ wait, perPage }: { wait: number; perPage: number }) => {
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