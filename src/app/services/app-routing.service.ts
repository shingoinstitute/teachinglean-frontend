import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AppRoutingService {

	// Observable sources
	onNextRouteSource = new Subject<any>();
	
	// Stack of urls to redirect to after task completions on components
	urlRedirectStack: string[] = [];

	constructor(private router: Router) {}

	setPathsToFollow(paths: string[]): Observable<any> {
		this.urlRedirectStack = paths;
		return this.onNextRouteSource.asObservable();
	}

	toNextPath() {
		if (this.urlRedirectStack.length > 0) {
			let nextPath = this.urlRedirectStack.shift();
			this.router.navigate([nextPath]);
			this.onNextRouteSource.next(true)
		} else {
			this.onNextRouteSource.next(false);
		}
	}

}