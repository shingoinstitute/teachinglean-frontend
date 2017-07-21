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
      this._us.getUsers().subscribe((data: any) => {
         const users = data.map(User.initFromObject);
         this.dataChange.next(users);
      }, err => {
         this.dataChange.next([]);
         console.error(err);
      });
   }
}

export class UserDataSource extends DataSource<any> {
   constructor(private _udp: UserDataProvider, private _paginator: MdPaginator, private _sort: MdSort) {
      super();
   }

   connect(): Observable<User[]> {
      const dataChanges = [
         this._udp.dataChange,
         this._paginator.page,
         this._sort.mdSortChange
      ];

      return Observable.merge(...dataChanges).map(() => {
         const data = this.getSortedData();
         
         // Get slice of sorted data
         const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
         return data.splice(startIndex, this._paginator.pageSize);
      });

   }

   disconnect() {}

   /** Returns a sorted copy of the database data. */
  getSortedData(): User[] {
    const data = this._udp.data.slice();
    if (!this._sort.active || this._sort.direction == '') { return data; }

    return data.sort((a, b) => {
      let propertyA: number|string = '';
      let propertyB: number|string = '';

      switch (this._sort.active) {
        case 'name': [propertyA, propertyB] = [a.name, b.name]; break;
        case 'email': [propertyA, propertyB] = [a.email, b.email]; break;
        case 'username': [propertyA, propertyB] = [a.username, b.username]; break;
        case 'role': [propertyA, propertyB] = [a.role, b.role]; break;
      }

      let valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      let valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction == 'asc' ? 1 : -1);
    });
  }

}
