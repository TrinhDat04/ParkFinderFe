import {
  Component,
  Output,
  EventEmitter,
  PLATFORM_ID,
  Inject, OnInit,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
} from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import {FilterDialogComponent} from '../filter-dialog/filter-dialog.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss'],
})
export class SearchBoxComponent implements OnInit {
  searchControl = new FormControl('');
  results: { name: string; placeId: string }[] = [];

  @Output() resultSelected = new EventEmitter<{ lat: number; lng: number }>();

  private autocompleteService!: google.maps.places.AutocompleteService;
  private placesService!: google.maps.places.PlacesService;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private dialog: MatDialog
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.initGoogleSearch();
    }
  }

  ngOnInit(): void {
      this.openFilterDialog();
  }

  initGoogleSearch() {
    const checkGoogleLoaded = () => {
      if (window?.google?.maps) {
        this.autocompleteService = new google.maps.places.AutocompleteService();
        const dummyDiv = document.createElement('div');
        this.placesService = new google.maps.places.PlacesService(dummyDiv);

        this.searchControl.valueChanges
          .pipe(debounceTime(300), distinctUntilChanged())
          .subscribe((query) => {
            if (!query) {
              this.results = [];
              return;
            }

            this.autocompleteService.getPlacePredictions(
              {input: query, componentRestrictions: {country: 'vn'}},
              (predictions, status) => {
                if (
                  status === google.maps.places.PlacesServiceStatus.OK &&
                  predictions
                ) {
                  this.results = predictions.map((p) => ({
                    name: p.description,
                    placeId: p.place_id,
                  }));
                } else {
                  this.results = [];
                }
              }
            );
          });
      } else {
        setTimeout(checkGoogleLoaded, 100);
      }
    };

    checkGoogleLoaded();
  }

  selectResult(result: { name: string; placeId: string }) {
    this.placesService.getDetails(
      {placeId: result.placeId, fields: ['geometry']},
      (place, status) => {
        if (
          status === google.maps.places.PlacesServiceStatus.OK &&
          place?.geometry?.location
        ) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          this.resultSelected.emit({lat, lng});
          this.results = [];
        }
      }
    );
  }

  openFilterDialog() {
    this.dialog.open(FilterDialogComponent, {
      width: '100vw',
      height: '100vh',
      maxWidth: '100vw',
      panelClass: 'full-screen-dialog'
    });
  }
}
