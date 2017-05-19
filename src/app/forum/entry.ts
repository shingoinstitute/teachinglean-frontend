// import { UserService } from '../services/user.service';

import { User } from '../user/user';

export class Entry {

  owner: User | string;
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

  constructor() { }

  static initFromObject(obj): Entry {
    let entry = new Entry();
    entry.title = obj.title;
    entry.answers = obj.answers;
    entry.comments = obj.comments;
    entry.content = obj.content;
    entry.id = obj.id;
    entry.isFlagged = obj.isFlagged;
    entry.markedCorrect = obj.markedCorrect;
    entry.owner = obj.owner instanceof String ? obj.owner : User.initFromObject(obj.owner);
    entry.usersDidDownvote = obj.users_did_downvote;
    entry.usersDidUpvote = obj.users_did_upvote;
    return entry;
  }

  toObject() {
    return {
      owner: this.owner,
      uuid: this.id,
      parent: this.parent,
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
