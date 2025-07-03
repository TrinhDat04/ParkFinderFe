import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FilterData } from '../../models/filter-data.interface';

type DropdownKey = 'category' | 'price' | 'feature' | 'scale' | 'rating';

@Component({
  selector: 'app-filter-dialog',
  templateUrl: './filter-dialog.component.html',
  styleUrl: './filter-dialog.component.scss'
})
export class FilterDialogComponent implements OnInit {
  
  constructor(
    private dialogRef: MatDialogRef<FilterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  // Sửa kiểu cho dropdownOpen
  dropdownOpen: Record<DropdownKey, boolean> = {
    category: false,
    price: false,
    feature: false,
    scale: false,
    rating: false
  };

  categories = [
    { name: 'Bãi xe', selected: false },
    { name: 'Trạm sạc', selected: false },
    { name: 'Trạm dừng nghỉ', selected: false },
    { name: 'Hầm gửi xe', selected: false },
  ];
  prices = [
    { name: 'Dưới 10k', selected: false },
    { name: '10k - 20k', selected: false },
    { name: 'Trên 20k', selected: false }
  ];
  features = [
    { name: 'Gửi xe máy', selected: false },
    { name: 'Gửi Ô tô', selected: false },
    { name: 'Có mái che', selected: false },
    { name: 'Gửi qua đêm', selected: false },
    { name: 'Có camera giám sát', selected: false },
    { name: 'Có sạc xe điện', selected: false },
  ];
  scales = [
    { name: 'Nhỏ', selected: false },
    { name: 'Vừa', selected: false },
    { name: 'Lớn', selected: false }
  ];
  ratings = [
    { name: '1 sao', selected: false },
    { name: '2 sao', selected: false },
    { name: '3 sao', selected: false },
    { name: '4 sao', selected: false },
    { name: '5 sao', selected: false }
  ];

  ngOnInit() {
    if (this.data && this.data.savedFilters) {
      this.restoreFilters(this.data.savedFilters);
    }
  }

  private restoreFilters(savedFilters: FilterData) {
    if (savedFilters.categories) {
      this.categories.forEach(cat => {
        const savedCat = savedFilters.categories.find(sc => sc.name === cat.name);
        if (savedCat) {
          cat.selected = savedCat.selected;
        }
      });
    }
    
    if (savedFilters.prices) {
      this.prices.forEach(price => {
        const savedPrice = savedFilters.prices.find(sp => sp.name === price.name);
        if (savedPrice) {
          price.selected = savedPrice.selected;
        }
      });
    }
    
    if (savedFilters.features) {
      this.features.forEach(feature => {
        const savedFeature = savedFilters.features.find(sf => sf.name === feature.name);
        if (savedFeature) {
          feature.selected = savedFeature.selected;
        }
      });
    }
    
    if (savedFilters.scales) {
      this.scales.forEach(scale => {
        const savedScale = savedFilters.scales.find(ss => ss.name === scale.name);
        if (savedScale) {
          scale.selected = savedScale.selected;
        }
      });
    }
    
    if (savedFilters.ratings) {
      this.ratings.forEach(rating => {
        const savedRating = savedFilters.ratings.find(sr => sr.name === rating.name);
        if (savedRating) {
          rating.selected = savedRating.selected;
        }
      });
    }
  }

  private getCurrentFilters(): FilterData {
    return {
      categories: [...this.categories],
      prices: [...this.prices],
      features: [...this.features],
      scales: [...this.scales],
      ratings: [...this.ratings]
    };
  }

  get selectedCategoryCount() {
    return this.categories.filter(c => c.selected).length;
  }
  get selectedFeatureCount() {
    return this.features.filter(f => f.selected).length;
  }
  get selectedPriceCount() {
    return this.prices.filter(p => p.selected).length;
  }
  get selectedScaleCount() {
    return this.scales.filter(s => s.selected).length;
  }
  get selectedRatingCount() {
    return this.ratings.filter(r => r.selected).length;
  }
  get totalSelectedCount() {
    return this.selectedCategoryCount + this.selectedFeatureCount + 
           this.selectedPriceCount + this.selectedScaleCount + this.selectedRatingCount;
  }

  toggleDropdown(type: DropdownKey) {
    this.dropdownOpen[type] = !this.dropdownOpen[type];
  }

  toggleCategory(cat: any) {
    cat.selected = !cat.selected;
  }
  togglePrice(price: any) {
    price.selected = !price.selected;
  }
  toggleFeature(feature: any) {
    feature.selected = !feature.selected;
  }
  toggleScale(scale: any) {
    scale.selected = !scale.selected;
  }
  toggleRating(rating: any) {
    rating.selected = !rating.selected;
  }

  onCloseFilter(event: Event): void {
    event.preventDefault(); // Ngăn reload hoặc scroll top
    const currentFilters = this.getCurrentFilters();
    this.dialogRef.close({ 
      totalSelected: this.totalSelectedCount,
      savedFilters: currentFilters
    });
  }

  applyFilter() {
    const currentFilters = this.getCurrentFilters();
    this.dialogRef.close({ 
      totalSelected: this.totalSelectedCount,
      savedFilters: currentFilters
    });
  }

  clearAllFilters() {
    this.categories.forEach(cat => cat.selected = false);
    this.prices.forEach(price => price.selected = false);
    this.features.forEach(feature => feature.selected = false);
    this.scales.forEach(scale => scale.selected = false);
    this.ratings.forEach(rating => rating.selected = false);
  }
}
