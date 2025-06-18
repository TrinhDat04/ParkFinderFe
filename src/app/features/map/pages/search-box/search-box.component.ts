import { Component, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, switchMap, distinctUntilChanged } from 'rxjs/operators';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MAP_ENDPOINTS } from '../../../../core/constants/endpoints/map-endpoints';
import { ParkingLotsLocationDto } from '../../models/parking-lots-location-dto'

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.css']
})
export class SearchBoxComponent {
  searchControl = new FormControl('');
  results: ParkingLotsLocationDto[] = [];

  @Output() resultSelected = new EventEmitter<{ lat: number, lng: number }>();

  constructor(private http: HttpClient) {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => query ? this.fetchResults(query) : of([]))
    ).subscribe(results => {
      this.results = results;
    });
  }

  fetchResults(query: string) {
    const url = `${MAP_ENDPOINTS.getParkingLotLocation(query)}`;
    return this.http.get<ParkingLotsLocationDto[]>(url);
  }

  selectResult(result: ParkingLotsLocationDto) {
  if (result.latitude && result.longitude) {
    this.resultSelected.emit({
      lat: result.latitude,
      lng: result.longitude
    });
  }
  this.results = [];
}
}