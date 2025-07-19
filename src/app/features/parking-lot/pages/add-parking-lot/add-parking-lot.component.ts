import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {FeatureService} from '../../../../core/services/feature/feature.service';
import {AddParkingLotRequest} from '../../../../core/models/parking-lot/add-parking-lot-request';
import {ParkingLotService} from '../../../../core/services/parking-lot/parking-lot.service';
import Swal from 'sweetalert2';
import {Router} from '@angular/router';
import {VehicleTypeService} from '../../../../core/services/vehicle-type/vehicle-type.service';
import {VehicleType} from '../../../../core/models/vehicle-type/vehicle-type';
import {ParkingPrice} from '../../../../core/models/parking-lot/parking-price';

@Component({
  selector: 'app-add-parking-lot',
  templateUrl: 'add-parking-lot.component.html',
  styleUrls: ['add-parking-lot.component.scss']
})
export class AddParkingLotComponent implements OnInit {
  constructor(private featureService: FeatureService,
              private parkingLotService: ParkingLotService,
              private vehicleTypeService: VehicleTypeService,
              private router: Router) {
  }

  ngOnInit() {
    this.featureService.getFeatures().subscribe({
      next: res => {
        this.featureOptions = res;
        this.featureOptions.forEach(f => {
            this.featuresMap[f.name] = false;
          }
        );
      }
    });

    this.vehicleTypeService.getVehicleTypes().subscribe({
      next: res => {
        this.vehicleTypes = res;
        this.vehicleTypes.forEach((vehicleType: VehicleType) => {
          this.priceMap[vehicleType.id] = null;
        });
      }
    })
  }

  vehicleTypes: VehicleType[] = [];
  featuresMap: Record<string, boolean> = {};
  priceMap: Record<number, number | null> = {};
  featureOptions: { id: number; name: string }[] = [];

  validationErrors: { [key: string]: string } = {};

  selectedOpenTimeOption = '24';
  openTime = '00:00';
  closeTime = '23:59';
  name = '';
  description: string | null = null;
  totalSlots: number | undefined;

  protected readonly window = window;

  submitReview(form: NgForm): void {
    const selectedFeatureIds = this.featureOptions
      .filter(f => this.featuresMap[f.name])
      .map(f => f.id
      );
    const parkingPrices: ParkingPrice[] = Object.entries(this.priceMap)
      .filter(([_, price]) => price !== null) // Exclude null values
      .map(([vehicleTypeId, price]) => ({
          vehicleTypeId: Number(vehicleTypeId),
          price
        }
      ))

    let openAt, closeAt;

    if (this.selectedOpenTimeOption === '24') {
      openAt = null;
      closeAt = null;
    } else {
      openAt = this.openTime;
      closeAt = this.closeTime;
    }

    const request: AddParkingLotRequest = {
      name: this.name,
      description: this.description,
      totalSlots: this.totalSlots,
      openTime: openAt,
      closeTime: closeAt,
      featureIds: selectedFeatureIds,
      parkingPrices: parkingPrices
    }

    this.parkingLotService.registerParkingLot(request).subscribe({
        next: res => {
          Swal.fire({
            icon: 'success',
            title: 'Đăng ký thành công!',
            timer: 2000,
            showConfirmButton: false
          }).then(() => {
            // Navigate after SweetAlert closes
            this.router.navigate(['/homepage']);
          });
        },
        error: error => {
          this.validationErrors = {}; // Reset previous errors
          if (error.status === 400) {
            if (error.error && Array.isArray(error.error)) {
              error.error.forEach((err: { memberNames: string[]; errorMessage: string }) => {
                if (err.memberNames.length > 0) {
                  this.validationErrors[err.memberNames[0]] = err.errorMessage;
                }
              });
            }
            console.error(error.error);
          } else {
            window.alert('Đã có lỗi xảy ra. Vui lòng thử lại sau.');
            console.error(error);
          }
        }
      }
    )
  }

  protected readonly Object = Object;
}
