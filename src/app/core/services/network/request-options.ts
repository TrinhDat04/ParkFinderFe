import { ENVIRONMENT } from "../../../../environments/environment";

export interface RequestOptions {
    serviceUrl?: keyof typeof ENVIRONMENT.serviceUrl;
    endpoint?: string;
    paramsObj?: { [param: string]: any };
}
