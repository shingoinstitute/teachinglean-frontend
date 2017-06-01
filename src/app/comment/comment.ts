
import { User } from '../user/user';
import { Entry } from '../entry/entry';

export class Comment implements CommentInterface {

   id: string | number;
   content: string;
   owner: User;
   ownerId: string;
   parent: Entry;
   parentId: Entry;
   createdAt: Date;
   updatedAt: Date;

   get ownerName() {
      return this.owner && this.owner.name ? this.owner.name : "";
   }

   constructor() {}

   static initFromObject(obj: any): Comment {
      let comment = new Comment();
      comment.id = obj.id;
      comment.content = obj.content || null;
      comment.createdAt = new Date(obj.createdAt) || null;
      comment.updatedAt = new Date(obj.updatedAt) || null;
      comment.ownerId = (obj.owner && obj.owner.uuid ? obj.owner.uuid : obj.owner) || null;
      comment.parentId = (obj.parent && obj.parent.id ? obj.parent.id : obj.parent) || null;
      return comment;
   }

   // Formats date to 'MMM dd, yyyy, hh:mm a'
   createdAtToString() {
      if (this.createdAt) {
         return `${this.createdAt.toLocaleDateString([], {month: "short", day: "numeric", year: "numeric"})}, ${this.createdAt.toLocaleTimeString([], {"hour": "2-digit", "minute": "2-digit", "hour12": true})}`;
      }
      return "n/a";
   }

}

interface CommentInterface {
   id: string | number;
   content: string;
   owner: User;
   ownerId: string;
   ownerName: string;
   parent: Entry;
   parentId: Entry;
   createdAt: Date;
   updatedAt: Date;
}