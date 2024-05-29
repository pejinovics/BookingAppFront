export interface Registration {
	id?: number;
	name: string;
	lastname: string;
	address: Address;
	userType: string;
	email: string;
	password: string;
	phoneNumber: string;
}

export interface Address {
	street: string;
	city: string;
	postalCode: number;
	state: string;
}
