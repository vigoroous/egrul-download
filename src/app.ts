import axios from "axios";
import { getSearchRequest } from "./api/getSearchRequest";
import { getVypDownloadRequest } from "./api/getVypDownload";
import { getVypRequest } from "./api/getVypRequest";
import { getVypStatusRequest } from "./api/getVypStatusRequest";
import { postInnRequest } from "./api/postInnRequest";









const main = async () => {
    // var bodyFormData = new FormData();
    // bodyFormData.append('query', '9723011265');

    const innRes = await postInnRequest("9723011265");

    if (innRes.status !== 200) {
        console.log("innRequest fault");
        return;
    }

    console.log(innRes.data);

    const searchRes = await getSearchRequest(innRes.data.t);

    if (searchRes.status !== 200) {
        console.log("searchRequest fault");
        return;
    }

    console.log(searchRes.data);

    const vypRes = await getVypRequest(searchRes.data.rows[0].t);

    if (vypRes.status !== 200) {
        console.log("vypRequest fault");
        return;
    }

    console.log(vypRes.data);

    let status: "wait" | "ready" = "wait";

    while (status !== "ready") {
        const vypStatusRes = await getVypStatusRequest(searchRes.data.rows[0].t);

        if (vypStatusRes.status !== 200) {
            console.log("vypStatusRequest fault");
            return;
        }

        status = vypStatusRes.data.status;
        console.log(status);
    }

    await getVypDownloadRequest(searchRes.data.rows[0].t);

    console.log("OK");


}

main();