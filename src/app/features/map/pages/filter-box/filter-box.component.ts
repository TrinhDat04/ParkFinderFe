import { Component, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {FilterDialogComponent} from '../filter-dialog/filter-dialog.component';
import { FilterData } from '../../models/filter-data.interface';

@Component({
  selector: 'app-filter-box',
  templateUrl: './filter-box.component.html',
  styleUrl: './filter-box.component.scss'
})
export class FilterBoxComponent {
  selectedFilterCount = 0;
  savedFilters: FilterData | null = null;

  @Output() filtersChanged = new EventEmitter<FilterData | null>();

  constructor(private dialog: MatDialog) { }

  toggleFilterBox(event: MouseEvent): void {
     event.stopPropagation();
    const dialogRef = this.dialog.open(FilterDialogComponent, {
      width: '100vw',
      height: '100vh',
      maxWidth: '100vw',
      panelClass: 'full-screen-dialog',
      data: { 
        selectedCount: this.selectedFilterCount,
        savedFilters: this.savedFilters
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Filter dialog closed with result:', result);
        this.selectedFilterCount = result.totalSelected;
        this.savedFilters = result.savedFilters;
        
        // Emit savedFilters ra cho search-box
        this.filtersChanged.emit(this.savedFilters);
      }
    });
  }
}
