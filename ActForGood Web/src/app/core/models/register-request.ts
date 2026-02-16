export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  userType: 'DONOR' | 'NGO' | 'ORPHANAGE' | 'ASSOCIATION';
  location?: string;
  country?: string;
}
