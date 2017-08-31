import { DataSource } from "@angular/cdk";
import { MdPaginator, MdSort } from "@angular/material";

import { UserDataProvider } from "app/services/user-data-provider.service";
import { Observable } from "rxjs/Observable";
import { User } from "app/user/user";

export class UserDataSource extends DataSource<any> {

   constructor(
      private _udp: UserDataProvider,
      private _paginator: MdPaginator,
      private _sort: MdSort
   ) {
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
         const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
         return data.splice(startIndex, this._paginator.pageSize);
      });

   }

   disconnect() { }

   /** Returns a sorted copy of the database data. */
   getSortedData(): User[] {
      const data = this._udp.data.slice();
      
      if (!this._sort.active || this._sort.direction == '') { return data; }
      
      return data.sort((a, b) => {
         let propertyA: number | string = '';
         let propertyB: number | string = '';

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