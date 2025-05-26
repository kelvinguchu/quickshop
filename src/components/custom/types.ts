export interface MeasurementData {
  // Basic measurements
  chest: string;
  shoulder: string;
  sleeve: string;
  length: string;
  waist: string;
  hip: string;
  // Customer info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  // Shipping address
  address: string;
  city: string;
  country: string;
  postalCode: string;
  // Additional notes
  notes: string;
}
