export interface ValidateBranch {
  branchId: string;
  customerTypeId: string;
}

export interface ValidateCity {
  city: string;
}

export interface ValidateClubNumber {
  clubNumber: string;
  customerTypeId: string;
}

export interface ValidateCompany {
  companyName: string;
  customerTypeId: string;
}

export interface ValidateCompanyOnly {
  companyName: string;
}

export interface ValidateCustomerType {
  customerTypeId: string;
}

export interface ValidateEmail {
  email: string;
}

export interface ValidateFurtherAddress {
  addresszusatz: string;
}

export interface ValidateLeitwegId {
  leitwegId: string;
}

export interface ValidatePassword {
  password: string;
  username?: string;
}

export interface ValidatePhoneNumber {
  phoneNumber: string;
}

export interface ValidateSalutation {
  salutationId: string;
  customerTypeId: string;
}

export interface ValidateStreet {
  street: string;
}

export interface BlacklistStreet {
  street: string;
  countryCode: string;
}

export interface ValidateTaxnumber {
  taxnumber: string;
  customerTypeId: string;
}

export interface ValidateTaxnumberOfBusiness {
  taxnumber: string;
  customerTypeId: string;
}

export interface ValidateUserName {
  username: string;
}

export interface ValidateVatNumber {
  vatNumber: string;
  countryCode: string;
}

export interface ValidateZip {
  zip: string;
  countryCode: string;
}

export interface BlacklistZip {
  zip: string;
  countryCode: string;
}

export interface ValidateName {
  name: string;
}

export interface IsInterco {
  email: string;
}

export interface AddressError {
  error: boolean;
  suggestions: string[];
}

export interface AddressValidationResponse {
  success: boolean;
  streetErrors: AddressError;
  postCodeErrors: AddressError;
  cityErrors: AddressError;
}

export interface AddressValidation {
  street: string;
  postalCode: string;
  city: string;
}

export interface ValidationObject {
  [key: string]: boolean | null;
}
