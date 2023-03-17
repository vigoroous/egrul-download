import axios from "axios";
import logger from "../../config/logger";

type BranchType = "MAIN" | "BRANCH";
type OrgStatus = "ACTIVE" | "LIQUIDATING" | "LIQUIDATED" | "BANKRUPT" | "REORGANIZING";
type OrgType = "LEGAL" | "INDIVIDUAL";

type OrganizationInfo = {
    value: string;
    unrestricted_value: string;
    data: {
        kpp: string;
        capital: null;
        management: {
            name: string;
            post: string;
            disqualified: null;
        };
        founders: null;
        managers: null;
        predecessors: null;
        successors: null;
        branch_type: BranchType;
        branch_count: number;
        source: null;
        qc: null;
        hid: string;
        type: OrgType;
        state: {
            status: OrgStatus;
            actuality_date: Date;
            registration_date: Date;
            liquidation_date: null;
        };
        opf: {
            type: string;
            code: string;
            full: string;
            short: string;
        };
        name: {
            full_with_opf: string;
            short_with_opf: string;
            latin: null;
            full: string;
            short: string;
        };
        inn: string;
        ogrn: string;
        okato: string;
        oktmo: string;
        okpo: string;
        okogu: string;
        okfs: string;
        okved: string;
        okveds: null;
        authorities: null;
        documents: null;
        licenses: null;
        finance: null;
        address: {
            value: string;
            unrestricted_value: string;
        };
        phones: null;
        emails: null;
        ogrn_date: Date;
        okved_type: string;
        employee_count: null;
    };
};

type SuggestionsResponse = {
    suggestions: Array<OrganizationInfo>;
}

export const postSuggestions = async (inn: string) => {
    try {
        const res = await axios<SuggestionsResponse>({
            method: "post",
            url: "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/party",
            data: new URLSearchParams({
                query: inn,
            }),
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });

        logger.info({
            context: "postSuggestions",
            params: {
                inn,
            },
            message: res.data
        });

        return res.data;

    } catch (e) {
        logger.error({
            context: "postSuggestions",
            params: {
                inn,
            },
            message: e
        });

        return null;
    }
}