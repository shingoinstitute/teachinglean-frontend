import { UserService } from '../services/user.service';
import { Http } from '@angular/http';

import { User } from '../user/user';

export class Entry {

  get owner(): User {
    return this._owner === null ? User.initFromObject({uuid: this._ownerId}) : this._owner;
  }
  _owner: User;
  _ownerId: string;
  id: string;
  parent: string;
  title: string;
  content: string;
  markedCorrect: boolean;
  isFlagged: boolean;
  answers: Entry[];
  usersDidUpvote: string[];
  usersDidDownvote: string[];
  comments: string[];
  createdAt: Date;
  updatedAt: Date;

  constructor() { }

  static initFromObject(obj): Entry {
    // console.log('init obj: ', obj);
    let entry = new Entry();
    if (!obj.id) {
      return entry;
    }
    entry.id = obj.id;
    entry.title = obj.title || null;
    entry.answers = obj.answers || [];
    entry.comments = obj.comments || [];
    entry.content = obj.content || null;    
    entry.isFlagged = obj.isFlagged || false;
    entry.markedCorrect = obj.markedCorrect || false;
    entry.parent = obj.parent || null;

    if (obj.owner && obj.owner.uuid) {
      entry._owner = User.initFromObject(obj.owner);
      entry._ownerId = obj.owner.uuid;
    } else if (typeof obj.owner === 'string') {
      entry._ownerId = obj.owner;
    } else {
      entry._ownerId = entry._owner = null;
    }

    entry.usersDidDownvote = obj.users_did_downvote || [];
    entry.usersDidUpvote = obj.users_did_upvote || [];

    entry.createdAt = obj.createdAt ? new Date(obj.createdAt) : new Date();
    entry.updatedAt = obj.updatedAt ? new Date(obj.updatedAt) : null;

    return entry;
  }

  downvoteCount() {
    return this.usersDidDownvote.length;
  }

  upvoteCount() {
    return this.usersDidUpvote.length;
  }

  userDidVote(userId: string) {
    let index = this.usersDidUpvote.indexOf(userId);
    return index !== -1;
  }

  userDidUpvote(userId: string) {
    let index = this.usersDidDownvote.indexOf(userId);
    return index !== -1;
  }

  toObject() {
    return {
      owner: this.owner,
      id: this.id,
      parent: this.parent || null,
      title: this.title,
      content: this.content,
      markedCorrect: this.markedCorrect,
      isFlagged: this.isFlagged,
      answers: this.answers,
      users_did_upvote: this.usersDidUpvote,
      users_did_downvote: this.usersDidDownvote,
      comments: this.comments
    };
  }

}
