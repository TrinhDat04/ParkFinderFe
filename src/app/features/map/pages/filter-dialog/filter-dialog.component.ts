import { Component } from '@angular/core';

type DropdownKey = 'category' | 'price' | 'feature' | 'scale' | 'rating';

@Component({
  selector: 'app-filter-dialog',
  templateUrl: './filter-dialog.component.html',
  styleUrl: './filter-dialog.component.scss'
})
export class FilterDialogComponent {

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
    { name: 'Trạm sạc', selected: false }
  ];
  prices = [
    { name: 'Dưới 10k', selected: false },
    { name: '10k - 20k', selected: false },
    { name: 'Trên 20k', selected: false }
  ];
  features = [
    { name: 'RỬA XE', selected: false },
    { name: 'WHITE', selected: false },
    { name: 'GREY', selected: false },
    { name: 'YELLOW', selected: false },
    { name: 'BLUE', selected: false },
    { name: 'PURPLE', selected: false },
    { name: 'GREEN', selected: false },
    { name: 'RED', selected: false },
    { name: 'PINK', selected: false },
    { name: 'ORANGE', selected: false },
    { name: 'GOLD', selected: false },
    { name: 'SILVER', selected: false }
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

  get selectedCategoryCount() {
    return this.categories.filter(c => c.selected).length;
  }
  get selectedFeatureCount() {
    return this.features.filter(f => f.selected).length;
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
}
