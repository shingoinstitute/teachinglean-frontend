import { Component, Input } from '@angular/core';
import { User } from '../user/user';
import { Entry } from './entry';

@Component({
   selector: 'app-user-info-card',
   template: `
   <div fxLayout="column" fxLayoutAlign="end end" class="entry-by">
      <p class="grey-text text-xs">{{ detailText }}</p>
      <img src="{{ pictureUrl }}">
   </div>
   `,
   styleUrls: ['./entry.component.css']
})
export class UserInfoCardComponent {
   @Input() user: User;
   @Input() entry: Entry;

   get pictureUrl() { 
      return this.user && this.user.pictureUrl ? this.user.pictureUrl : "https://res.cloudinary.com/shingo/image/upload/v1414874243/silhouette_vzugec.png"; 
   }

   get detailText() {
      let text = this.entry && this.entry.parent ? `Answered ` : `Asked `;
      text += this.entry.owner ? `by ` + this.entry.owner.username : ``;
      text += ` on ${this.entry.createdAtToString()}`
      return text;
   }
}