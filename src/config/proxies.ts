import axios from "axios";

export const proxies = [
    { host: "64.225.8.121", port: 9999 },
    // { host: "64.225.4.12", port: 9999 },
    // { host: "37.120.192.154", port: 8080 },
    // { host: "144.76.42.215", port: 8118 },
    // { host: "202.40.188.92", port: 40486 },
    // { host: "138.0.172.112", port: 3128 },
    // { host: "64.225.8.121", port: 9999 },
    // { host: "65.108.230.238", port: 42645 },
    // { host: "95.143.8.182", port: 57169 },
].values();

export const setAxiosConfig = (host: string, port: number, protocol = "https") => {
    axios.defaults.proxy = { host, port, protocol };
}

axios.defaults.timeout = 10000;