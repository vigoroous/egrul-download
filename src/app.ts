import { chunk } from "lodash";
import { proxies, setAxiosConfig } from "./config/proxies";
import { getUnhandledCompanies, upsertCompany } from "./handlers/companyHandler";
import { downloadHandler } from "./handlers/downloadHandler";
import { delay, readAllLines, readColumnXlsx } from "./utils";


const main = async () => {
    const inputInnArr = readColumnXlsx("data/input.xlsx", "B");
    // const inputInnArr = readAllLines("data/input.txt");

    for (const inn of inputInnArr) {
        await upsertCompany(inn);
    }

    const unhandledCompanies = await getUnhandledCompanies();
    if (!unhandledCompanies) return;

    const preparedInnArr = chunk(unhandledCompanies.map((v) => v.inn), 20);


    for (let i = 0; i < preparedInnArr.length; i++) {
        await downloadHandler(preparedInnArr[i], 300);
    }
}


main();