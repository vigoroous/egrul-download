import { chunk } from "lodash";
import { proxies, setAxiosConfig } from "./config/proxies";
import { CompanyService } from "./services/company.service";
import { delay, readAllLines, readColumnXlsx } from "./utils";
import { EgrulPullingService } from "./services/egrulPulling.service";
import { DadataPullingService } from "./services/dadataPulling.service";


const perPage = 20;

const main = async () => {
    const inputInnArr = readColumnXlsx("data/input.xlsx", "B");
    const inputInnArr2 = readAllLines("data/input.txt");
    const inputInnArr3 = inputInnArr.concat(inputInnArr2);

    for (const inn of inputInnArr3.flatMap(line => line.split(" "))) {
        await CompanyService.upsertCompany(inn);
    }

    const unhandledEgrulCompanys = await CompanyService.getUnhandledEgrulCompanys();
    if (!unhandledEgrulCompanys) return;

    const preparedInnArr = chunk(unhandledEgrulCompanys.map((v) => v.inn), perPage);


    for (let i = 0; i < preparedInnArr.length; i++) {
        const res = await EgrulPullingService.egrulSearch(preparedInnArr[i], 300, 1);

        if (!res) continue;

        const totalPages = Math.ceil(res.total / perPage);
        if (totalPages > 1) {
            for (let page = 2; page < totalPages; page++) {
                await EgrulPullingService.egrulSearch(preparedInnArr[i], 300, page);
            }
        }
    }

    const unhandledDadataCompanys = await CompanyService.getUnhandledDadataCompanys();
    if (!unhandledDadataCompanys) return;

    for (const { inn } of unhandledDadataCompanys) {
        await DadataPullingService.getSuggestionsByInn(inn);
    }

}


main();