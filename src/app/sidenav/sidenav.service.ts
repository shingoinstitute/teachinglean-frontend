import { Injectable, Output } from '@angular/core';
import { MdSidenav } from '@angular/material';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class SidenavService {

    private _sidenav: MdSidenav;
    private _maxScreenWidth = 961;

    constructor(sidenav: MdSidenav) {
        this._sidenav = sidenav;
        this.setState();
    }

    setState() {
        // if (window.innerWidth < this._maxScreenWidth && this._sidenav.opened) {
        //     this._sidenav.close();
        // } else if (window.innerWidth < this._maxScreenWidth) {
        //     this._sidenav.close();
        // }
        window.innerWidth < this._maxScreenWidth ? this._sidenav.close() : this._sidenav.open();
    }

    toggle() {
        if (window.innerWidth < this._maxScreenWidth) {
            this._sidenav.toggle();
        }
    }

    open() {
        if (window.innerWidth >= this._maxScreenWidth) {
            this._sidenav.open();
        }
    }

    close() {
        if (window.innerWidth < this._maxScreenWidth) {
            this._sidenav.close();
        }
    }

}
