export type ServiceType = 'Couples' | 'Individuals';

export interface Package {
  id: number;
  service: ServiceType;
  name: string;
  priceMonthly: number | null;
  priceYearly: number | null;
  aboutPackage?: string;
  termsAndConditions?: string;
  created_at: string; // ISO
  updated_at: string; // ISO
}
