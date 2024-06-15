
/*
Interface for the Refresh Token (can look different, based on your backend api)
*/
export interface RefreshToken {
  id: number;
  userId: number;
  token: string;
  refreshCount: number;
  expiryDate: Date;
}

/*
Interface for the Login Response (can look different, based on your backend api)
*/
export interface LoginResponse {
  accessToken: string;
  refreshToken: RefreshToken;
  tokenType: string;
}

/*
Interface for the Login Request (can look different, based on your backend api)
*/
export interface LoginRequest {
  email: string;
  password: string;
}

/*
Interface for the Register Request (can look different, based on your backend api)
*/
export interface RegisterRequest {
  email: string;
  firstname: string;
  lastname: string;
  password: string;
  mobile: string;
  referralCode: string;
  referredByCode: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipcode: number;
  };
  role: string;
}

/*
Interface for the Register Response (can look different, based on your backend api)
*/
export interface RegisterResponse {
  status: number;
  message: string;
}


export interface User {
  firstname: string,
  middlename: string,
  lastname: string,
  email: string,
  username: string,
  mobile: string,
  referralCode: string,
  referredByCode: string,
  points: Number
}

export interface Address {
  "street": string,
  "city": string,
  "state": string,
  "country": string,
  "zipcode": Number
}

export interface Hostel {
  "id": number,
  "name": string,
  "type": string,
  "contact": string,
  "isActive": boolean,
  "rooms": [],
  "address": Address,
  "owner": User
}

export interface Error {
  code: string,
  message: string
}

export interface Response {
  data: any,
  error: Error []
}

export interface Room {
  "id": number,
  "roomNo": number;
  "floorNo": number;
  "capacity": number;
  "hostel": Hostel
}

export interface Tenant {
  "id": number,
  "firstName": string;
  "middleName": string;
  "lastName": string;
  "mobile": string,
  "idNumber": string,
  "idType": string,
  "entryDate": [],
  "exitDate": [],
  "isActive": boolean,
  "address": Address,
  "room": Room,
  "payments": []
}

export interface Expense {
  "id": number,
  "expenseType": string,
  "description": string,
  "amount": number,
  "date": string,
  "hostel": Hostel
}