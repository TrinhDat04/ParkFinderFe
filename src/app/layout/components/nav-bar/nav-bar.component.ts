import {Component} from '@angular/core';
import {MapService} from '../../../features/map/services/map.services';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent {
  hideNavbar = false;

  constructor(private uiState: MapService) {}

  ngOnInit() {
    this.uiState.hideNavbar$.subscribe(hidden => {
      this.hideNavbar = hidden;
    });
  }
}
