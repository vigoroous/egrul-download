import { chunk } from "lodash";
import { proxies, setAxiosConfig } from "./config/proxies";
import { CompanyService } from "./services/company.service";
import { delay, readAllLines, readColumnXlsx } from "./utils";
import { EgrulPullingService } from "./services/egrulPulling.service";


const perPage = 20;

const main = async () => {
    const inputInnArr = readColumnXlsx("data/input.xlsx", "B");
    // const inputInnArr = readAllLines("data/input.txt");

    for (const inn of inputInnArr.flatMap(line => line.split(" "))) {
        await CompanyService.upsertCompany(inn);
    }

    const unhandledCompanys = await CompanyService.getUnhandledEgrulCompanys();
    if (!unhandledCompanys) return;

    const preparedInnArr = chunk(unhandledCompanys.map((v) => v.inn), perPage);


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

}


main();