import { chunk } from "lodash";
import { proxies, setAxiosConfig } from "./config/proxies";
import { getUnhandledCompanies, upsertCompany } from "./handlers/companyHandler";
import { downloadHandler } from "./handlers/downloadHandler";
import { delay, readAllLines } from "./utils";


const main = async () => {
    const inputInnArr = readAllLines("input.txt");

    for (const inn of inputInnArr) {
        await upsertCompany(inn);
    }

    const unhandledCompanies = await getUnhandledCompanies();
    if (!unhandledCompanies) return;

    const preparedInnArr = chunk(unhandledCompanies.map((v) => v.inn), 20);

    // Prefire
    const res = proxies.next();
    setAxiosConfig(res.value.host, res.value.port);

    for (let i = 0; i < preparedInnArr.length; i++) {
        const downloadRes = await downloadHandler(preparedInnArr[i]);
        // await delay(2000);
        if (downloadRes) continue;

        const res = proxies.next();
        if (res.done) {
            // TODO: proxies done;
            return;
        }

        setAxiosConfig(res.value.host, res.value.port);

        i--;
    }
}


main();