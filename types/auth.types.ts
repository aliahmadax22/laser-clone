export interface LoginForm {
  email: string | null;
  password: string | null;
  saveLogin: boolean;
  deviceName: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
  saveLogin: boolean;
  deviceName: string | null;
}

export interface User {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
}

export interface LoginResponse {
  status: boolean;
  statusKey: string;
  user: User;
}

export interface BusinessDatas {
  businessName: string | null;
  taxNumber: string | null; // required when Small Business Owner
  vatNumber: string | null; // required when Business Customer or Reseller
  branchId: string | number | null; // optional
  clubNumber: string | null; // optional
  leitwegId: string | null; // optional
}

export interface RegisterForm {
  customerTypeId: number | null;
  salutationId: number | null; // full form
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  street: string | null; // full form
  postcode: string | null; // full form
  city: string | null; // full form
  addressDetails: string | null; // full form
  phone: string | null;
  noAddressValidation: boolean;
  password: string | null;
  confirmPassword?: string | null;
  contactBlock: boolean;
  subscribeNewsletter: boolean;
  businessDatas: BusinessDatas;
}

export interface RegisterRequest {
  customerTypeId: string;
  salutationId: string;
  firstName: string;
  lastName: string;
  email: string;
  street: string;
  postcode: string;
  city: string;
  addressDetails: string | null;
  phone: string;
  noAddressValidation: boolean;
  password: string;
  contactBlock: boolean;
  subscribeNewsletter: boolean;
  businessDatas: BusinessDatas;
}

export interface ShortRegisterRequest {
  customerTypeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  contactBlock: boolean;
  subscribeNewsletter: boolean;

  businessName: string | null;
  branchId: string | null; // optional
}

export interface RequestResetPasswordRequest {
  email: string;
}

export interface ValidateResetPasswordRequest {
  securityToken: string;
  email: string;
  ticks: number | string;
}

export interface ResetPasswordRequest {
  securityToken: string;
  email: string;
  ticks: number;
  newPassword: string;
}

export interface RegisterResponse {
  success: boolean;
  errors: string[] | null;
  streetErrors: {
    error: boolean;
    suggestions: string[];
  } | null;
  postCodeErrors: {
    error: boolean;
    suggestions: string[];
  } | null;
  cityErrors: {
    error: boolean;
    suggestions: string[];
  } | null;
}

export interface RegisterDropdownItem {
  active: boolean;
  id: number;
  description: string;
  resourceId: number;
  orderRank: number | null;
}

export interface RegisterDropdownsResponse {
  Salutation: RegisterDropdownItem[];
  AttentionSource: RegisterDropdownItem[];
  CustomerSubType: RegisterDropdownItem[];
  Country: RegisterDropdownItem[];
  CustomerType: RegisterDropdownItem[];
  Branch: RegisterDropdownItem[];
}
