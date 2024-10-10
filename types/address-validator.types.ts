import type { AddressError } from "~/types/validation.types";

export interface AddressValidationData {
  street: AddressError;
  postcode: AddressError;
  city: AddressError;
}
export interface AddressValidationSuggestion {
  id: string;
  name: string;
}

export interface AddressValidationSuggestions {
  street: AddressValidationSuggestion[] | null;
  postcode: AddressValidationSuggestion[] | null;
  city: AddressValidationSuggestion[] | null;
}

export interface AddressValidationColors {
  street: string | null;
  postcode: string | null;
  city: string | null;
}

export interface AddressValidationAutoCorrect {
  street: string | null;
  postcode: string | null;
  city: string | null;
}

export interface AddressValidatioFields {
  colors: AddressValidationColors;
  suggestions: AddressValidationSuggestions;
  autoCorrect: AddressValidationAutoCorrect;
}

export interface AddressValidationDataFields {
  validationData: AddressValidationData;
  fields: AddressValidatioFields;
}
