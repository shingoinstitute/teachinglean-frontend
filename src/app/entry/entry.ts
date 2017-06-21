// Angular imports
import { Injectable, ReflectiveInjector } from '@angular/core';
import { Http } from '@angular/http';

// Services
// import { EntryService } from '../services/entry.service';

// Misc imports
import { User } from '../user/user';
import { Comment } from '../comment/comment';



export class Entry {

  owner: User;
  _ownerId: string;
  id: string;
  parent: Entry;
  _parentId: string;
  title: string;
  content: string;
  markedCorrect: boolean;
  isFlagged: boolean;
  answers: Entry[];
  usersDidUpvote: string[];
  usersDidDownvote: string[];
  comments: Comment[];
  createdAt: Date;
  updatedAt: Date;

  constructor() {
    this.id = null;
    this.owner = null;
    this._ownerId = null;
    this.parent = null;
    this._parentId = null;
    this.title = null;
    this.markedCorrect = null;
    this.isFlagged = null;
    this.answers = null;
    this.usersDidUpvote = null;
    this.usersDidDownvote = null;
    this.comments = null;
    this.createdAt = null;
    this.updatedAt = null;
  }

  static initFromObject(obj): Entry {
    let entry = new Entry();
    if (!obj.id) {
      return entry;
    }
    entry.id = obj.id || null;
    entry.title = obj.title || null;
    entry.answers = obj.answers || [];
    entry.comments = obj.comments || [];
    entry.content = obj.content || null;    
    entry.isFlagged = obj.isFlagged || false;
    entry.markedCorrect = obj.markedCorrect || false;

    if (obj.parent && obj.parent.id) {
      delete obj.parent.parent;
      entry.parent = Entry.initFromObject(obj.parent);
    } else if (obj.parent) {
      entry._parentId = obj.parent;
    }

    if (obj.owner && obj.owner.uuid) {
      entry.owner = User.initFromObject(obj.owner);
    } else if (obj.owner) {
      entry._ownerId = obj.owner;
    }

    entry.usersDidDownvote = obj.users_did_downvote || [];
    entry.usersDidUpvote = obj.users_did_upvote || [];

    if (Array.isArray(obj.comments)) {
      entry.comments = obj.comments.map(Comment.initFromObject);
    }

    entry.createdAt = obj.createdAt ? new Date(obj.createdAt) : new Date();
    entry.updatedAt = obj.updatedAt ? new Date(obj.updatedAt) : null;

    return entry;
  }

  // Formats date to 'MMM dd, yyyy, hh:mm a'
  createdAtToString() {
		if (this.createdAt) {
			return `${this.createdAt.toLocaleDateString([], {month: "short", day: "numeric", year: "numeric"})}, ${this.createdAt.toLocaleTimeString([], {"hour": "2-digit", "minute": "2-digit", "hour12": true})}`;
		}
		return "n/a";
	}

  downvoteCount() {
    return this.usersDidDownvote ? this.usersDidDownvote.length : 0;
  }

  upvoteCount() {
    return this.usersDidUpvote ? this.usersDidUpvote.length : 0;
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
