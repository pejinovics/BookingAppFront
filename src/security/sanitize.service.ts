import { Injectable } from '@angular/core';
import * as DOMPurify from 'dompurify';

@Injectable({
	providedIn: 'root'
})
export class SanitizeService {

	constructor() { }

	sanitize(dirtyString: string): string {
		return DOMPurify.sanitize(dirtyString);
	}
}
