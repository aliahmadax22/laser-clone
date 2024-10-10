import type { Address } from "./user.types";
import type { PropertyConfiguration, PropertyValue } from "./pct.types";
import type { ArtworkData } from "./artwork-data.types";

export interface PriceDetails {
  vatRate: number;
  vat: number;
  discount: number;
  net: number;
  gross: number;
}

export interface ProductRange {
  min: number;
  max: number;
  step: number;
}

export interface ProductDisplay {
  id: number;
  resourceId: number;
  isRange: boolean;
  propertyValue: PropertyValue | null;
  containsImages?: boolean;
  range?: ProductRange | null;
}

export interface DeliveryAddress extends Address {}

export interface DeliveryDistribution {
  printRun: number;
  deliveryAddress: DeliveryAddress;
}

export interface Product {
  id: string;
  projectName: string;
  designer: string; // Change the type accordingly if designer has specific type
  printRun: number;
  productImage: string;
  productGroupName: string;
  productDisplayName: string;
  deliveryDate: string;
  propertyConfiguration: PropertyConfiguration[];
  productDisplay: ProductDisplay[];
  priceDetails: PriceDetails;
  deliveryDistribution: DeliveryDistribution[];
  artworkData: ArtworkData;
}

export interface Cart {
  stepNumber: number;
  paymentMethodId: string;
  termsAccepted: boolean;
  voucherCode: string | null;
  emailSubscribe: boolean;
  billingAddress: Address;
  priceDetails: PriceDetails;
  products: Product[];
}

export interface CartResponse {
  status: boolean;
  data: Cart;
}

export interface AddToCartRequest {
  productGroupId: number;
  propertyConfiguration: PropertyConfiguration[];
  deliveryDistribution: number[];
}
