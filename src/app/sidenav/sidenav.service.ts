import { Injectable, Output } from '@angular/core';
import { MdSidenav } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

@Injectable()
export class SidenavService {

    private _sidenav: MdSidenav;
    private _maxScreenWidth = 961;

    constructor(sidenav: MdSidenav) {
        this._sidenav = sidenav;

        const observable = new Observable<boolean>(observer => {
            return observer.next(window.innerWidth < this._maxScreenWidth);
        });

        observable.subscribe(
            shouldOpen => this._setState(shouldOpen)
        )
        .unsubscribe();
    }

    private _setState(open: boolean) {
        open ? this._sidenav.open() : this._sidenav.close();
    }

    getState(): boolean {
        return window.innerWidth < this._maxScreenWidth;
    }

    toggle() {
        if (window.innerWidth < this._maxScreenWidth) {
            this._sidenav.toggle();
        }
    }

    open(): boolean {
        if (window.innerWidth >= this._maxScreenWidth) {
            this._sidenav.open()
            .then(() => {
                return true;
            })
            .catch(reason => {
                this._handleError(reason);
                return false;
            });
        } else {
            return false;
        }
    }

    close(): boolean {
        if (window.innerWidth < this._maxScreenWidth) {
            this._sidenav.close()
            .then(() => {
                return true;
            })
            .catch(reason => {
                this._handleError(reason);
                return false;
            });
        } else {
            return false;
        }
    }

    private _handleError(reason) {
        let err = reason;
        if (err instanceof Error) {
            err = reason.message || reason.toString();
        }
        console.error(err);
    }

}
