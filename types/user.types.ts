import type { BusinessDatas } from "./auth.types";

interface BaseAddress {
  company: string | null;
  salutationId: number | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  street: string | null;
  zip: string | null;
  furtherAddress: string | null;
  city: string | null;
  phoneNumber: string | null;
  invoiceAddressType: number;
  deliveryAddressType: number;
}

export interface CustomerDataForm {
  customerTypeId: number;
  salutationId: number | null;
  firstName: string;
  lastName: string;
  address: string | null;
  zipCode: string | null;
  city: string | null;
  additionalAddress: string | null;
  phoneNumber: string | null;
  noAddressValidation: boolean;
  businessDatas: BusinessDatas;
}

export interface CustomerDataRequest {
  customerTypeId: number;
  salutationId: number;
  firstName: string;
  lastName: string;
  address: string;
  zipCode: string;
  city: string;
  additionalAddress: string | null;
  phoneNumber: string;
  noAddressValidation: boolean;
  businessDatas: BusinessDatas;
}

export interface LoginDataForm {
  email: string;
  confirmPassword: string | null;
  passwordOld: string | null;
  passwordNew: string | null;
}

export interface LoginDataRequest {
  email: string;
  passwordOld: string;
  passwordNew: string;
}
export interface StoreAddressRequest
  extends Omit<
    BaseAddress,
    | "salutationId"
    | "firstName"
    | "lastName"
    | "street"
    | "zip"
    | "city"
    | "phoneNumber"
  > {
  salutationId: number;
  firstName: string;
  lastName: string;
  street: string;
  phoneNumber: string;
  zip: string;
  city: string;
}

export interface StoreAddressForm extends BaseAddress {}

export interface Address extends StoreAddressRequest {
  addressId: string;
  customerId: string;
  isMainAddress: boolean;
  salutation: number;
  firstName: string;
  lastName: string;
  company: string;
  street: string;
  zip: string;
  city: string;
  countryCode: string;
  phone: string;
  email: string;
}

export interface OrderHistoryRequest {
  search: string | null;
  page: number;
  itemsPerPage: number;
}

export interface AddressesRequest {
  searchQuery: string | null;
  page: number;
  itemsPerPage: number;
  addressType: number;
}

export interface DeliveryInformation {
  circulation: number;
  formattedAddress: string;
  trackingUrl: string | null;
  trackingLinks: string | null;
}

export interface OrderPropertyValue {
  propertyId: number;
  propertyValueId: number;
  propertyResourceId: number;
  propertyValueResourceId: number | null;
  customValueOrCirculation: number;
  isHeadLine: boolean;
  description: string;
  propertyOrderRank: number;
}

export interface Order {
  jobnumber: number;
  ordernumber: string;
  projectname: string | null;
  orderDate: string;
  invoiceAmount: number;
  openAmount: number;
  uploadStatusLabel: string;
  paymentStatusLabel: string;
  processingStatusLabel: string;
  processingStatusColor: string;
  isDataUploadAvailable: boolean;
  isPaymentAvailable: boolean;
  isCancellationAvailable: boolean;
  isPrintReleaseAvailable: boolean;
  deliveryDate: string;
  deliveryInformations: DeliveryInformation[];
  propertyValues: OrderPropertyValue[];
}

export interface CostsPrice {
  vat: number;
  net: number;
  gross: number;
}

export interface CancelationCosts {
  cancelationPrice: CostsPrice;
  invoicenumber: number;
  productPrice: CostsPrice;
  savingWithCancellation: number;
  vatNew: number;
}

export interface DatacheckProtocolDetail {
  isWarning: boolean;
  headline: string;
  description: string;
}

export interface DatacheckProtocol {
  jobnumber: number;
  datacheckId: number;
  protocolContainsWarnings: boolean;
  protocolContainsErrors: boolean;
  details: DatacheckProtocolDetail[];
}

export interface PackagingSummaryRequest {
  year: number;
  month: number;
}

export interface PackagingSummaryResponse {
  paperCardboard: number;
  plastic: number;
  wood: number;
  itemsExist: boolean;
}
