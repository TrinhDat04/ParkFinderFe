export interface ParkingLot {
  name: string;
  description: string;
  openTime: string;
  closeTime: string;
  pricePerHour: number;
  utilities: string;
  totalSlots: number;
  availableSlots: number;
  status: string;
  rating: number;
  providerName: string;
}
