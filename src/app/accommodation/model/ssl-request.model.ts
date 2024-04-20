export interface SSLRequest {
	publicKey?: string;
	commonName?: string;
	organization?: string;
	email?: string;
	country?: string;
	certificateType?: CertificateType;
}

export enum CertificateType {
	END_ENTITY = 'END_ENTITY',
	INTERMEDIATE = 'INTERMEDIATE',
	HTTPS = 'HTTPS',
}
