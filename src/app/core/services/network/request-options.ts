import { ENVIRONMENT } from "../../../../environments/environment";
import {HttpHeaders} from '@angular/common/http';

export interface RequestOptions {
    serviceUrl?: keyof typeof ENVIRONMENT.serviceUrl;
    endpoint?: string;
    paramsObj?: { [param: string]: any };
    headers?: HttpHeaders;
}
