import { Component, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FilterDialogComponent } from '../filter-dialog/filter-dialog.component';
import { FilterData } from '../../models/filter-data.interface';
import { features } from 'process';

@Component({
  selector: 'app-filter-box',
  templateUrl: './filter-box.component.html',
  styleUrl: './filter-box.component.scss',
})
export class FilterBoxComponent {
  selectedFilterCount = 0;
  savedFilters: FilterData | null = null;

  @Output() filtersChanged = new EventEmitter<any | null>();

  constructor(private dialog: MatDialog) {}

  toggleFilterBox(event: MouseEvent): void {
    event.stopPropagation();
    const dialogRef = this.dialog.open(FilterDialogComponent, {
      width: '100vw',
      height: '100vh',
      maxWidth: '100vw',
      panelClass: 'full-screen-dialog',
      data: {
        selectedCount: this.selectedFilterCount,
        savedFilters: this.savedFilters,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Filter dialog closed with result:', result);
        this.selectedFilterCount = result.totalSelected;
        this.savedFilters = result.savedFilters;

        // Emit savedFilters ra cho search-box
        this.filtersChanged.emit(this.sendFilterData(this.savedFilters));
      }
    });
  }

  sendFilterData(filter: any) {
    if (!filter) return;
    const selectedCat: number[] = [];
    this.savedFilters?.categories.forEach((item, index) => {
      if (item.selected) {
        selectedCat.push(index + 1);
      }
    });

    const pricesLevel: string[] = [];
    this.savedFilters?.prices.forEach((item, index) => {
      if (item.selected) {
        switch (index) {
          case 0: {
            pricesLevel.push('<');
            break;
          }
          case 1: {
            pricesLevel.push('=');
            break;
          }
          case 2: {
            pricesLevel.push('>');
          }
        }
      }
    });

    const selectedFeatures: number[] = [];
    this.savedFilters?.features.forEach((item, index) => {
      if (item.selected) {
        selectedFeatures.push(index + 1);
      }
    });

    const selectedScales: number[] = [];
    this.savedFilters?.scales.forEach((item, index) => {
      if (item.selected) {
        selectedScales.push(index + 1);
      }
    });

    const selectedRatings: number[] = [];
    this.savedFilters?.ratings.forEach((item, index) => {
      if (item.selected) {
        selectedRatings.push(index + 1);
      }
    });

    var filterContent = {
      categories: selectedCat,
      prices: pricesLevel,
      features: selectedFeatures,
      scales: selectedScales,
      ratings: selectedRatings,
    };
    return filterContent;
  }
}
