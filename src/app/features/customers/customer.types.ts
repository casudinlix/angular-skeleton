export interface Customer {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly status: 'active' | 'inactive';
}
export interface CustomerInput {
  readonly name: string;
  readonly email: string;
  readonly status: 'active' | 'inactive';
}
