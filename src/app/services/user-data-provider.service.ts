import { Injectable } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { MatPaginator, MatSort } from '@angular/material';
import { BehaviorSubject ,  Observable } from "rxjs";
import { User } from "app/user/user";
import { UserService } from "app/services/user.service";

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
