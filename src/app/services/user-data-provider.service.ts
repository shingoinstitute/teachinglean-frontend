import { Injectable } from '@angular/core';
import { DataSource } from '@angular/cdk';
import { MdPaginator, MdSort } from '@angular/material';
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { User } from "app/user/user";
import { UserService } from "app/services/user.service";
import { Observable } from "rxjs/Observable";

@Injectable()
export class UserDataProvider {

   dataChange: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);
   get data(): User[] { return this.dataChange.value; }

   constructor(private _us: UserService) {
      this.dataChange.next([]);
      this._us.getUsers().subscribe((data: any) => {
         const users = data.map(User.initFromObject);
         this.dataChange.next(users);
      }, err => {
         this.dataChange.next([]);
         console.error(err);
      });
   }
}
