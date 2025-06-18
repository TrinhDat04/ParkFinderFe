import { Injectable } from "@angular/core";
import { MAP_ENDPOINTS } from "../../../core/constants/endpoints/map-endpoints";
import { ApiService } from "../../../core/services/network/api.service";
import { Observable } from "rxjs";


@Injectable({
    providedIn: 'root',
})
export class MapService {
    constructor(private apService : ApiService) {}

}