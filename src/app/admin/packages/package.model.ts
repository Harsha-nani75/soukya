export type ServiceType = 'Couples' | 'Individuals';

export interface Package {
  id: number;
  service: ServiceType;
  name: string;
  priceMonthly: number | null;
  priceYearly: number | null;
  description1?: string;
  description2?: string;
  createdAt: string; // ISO
  updatedAt: string; // ISO
}
