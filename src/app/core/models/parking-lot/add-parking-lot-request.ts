import {ParkingPrice} from './parking-price';

export interface AddParkingLotRequest{
  name: string;
  description: string | null;
  openTime: string | null;
  closeTime: string | null;
  totalSlots: number | undefined;
  featureIds: number[];
  parkingPrices: ParkingPrice[];
}
