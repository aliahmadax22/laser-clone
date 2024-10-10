export interface PropertyConfiguration {
  propertyId: number;
  value: number;
}

export interface PropertyValue {
  id: number;
  resourceId: number;
}

export interface PctTooltips {
  [key: string]: string;
}

export interface PropertyValueOption {
  id: number;
  topseller: boolean;
  resourceId: number;
  image: string;
  isDefault: boolean;
  isDisabled: boolean;
  additionalInfo: string | null;
  uploadDeadline: string | null;
}

export interface PropertyOptionRange {
  // TODO: Add the properties
}

export interface PropertyOption {
  id: number;
  resourceId: number;
  containsImages: boolean;
  isRange: boolean;
  propertyValueOptions: PropertyValueOption[];
  range?: PropertyOptionRange;
}

export interface AdditionalProductInformation {
  singleWeight: number;
  totalWeight: number;
}

export interface PctProps {
  propertyOptions: PropertyOption[];
  propertyConfiguration: PropertyConfiguration[];
  additionalProductInformation: AdditionalProductInformation;
}

export interface PriceScaleItem {
  printRun: number;
  price: number;
  difference: number;
}

export interface PriceDetails {
  priceNet: number;
  priceGross: number;
  vatRate: number;
  productWeight: number;
  productWeightTotal: number;
  priceScale: PriceScaleItem[];
}

export interface SuggestionUpdatedValues {
  propertyName: string | null;
  prevPropertyValueName: string | null;
  propertyValueName: string | null;
}

export interface Suggestions {
  updatedValues: SuggestionUpdatedValues[];
}

export interface PctForm {
  [key: string]: number;
}

export interface PctChangedProperty {
  propertyId: number;
  propertyValueId: number;
}
