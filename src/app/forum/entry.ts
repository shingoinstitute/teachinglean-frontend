export class Entry {

  owner: string;
  uuid: string;
  parent: string;
  title: string;
  content: string;
  markedCorrect: boolean;
  isFlagged: boolean;
  answers: Entry[];
  usersDidUpvote: string[];
  usersDidDownvote: string[];
  comments: string[];

  constructor() {
    this.owner = "";
    this.uuid = "";
    this.parent = "";
    this.title = "";
    this.content = "";
    this.markedCorrect = false;
    this.isFlagged = false;
    this.answers = [];
    this.usersDidUpvote = [];
    this.usersDidDownvote = [];
    this.comments = [];
  }

  toObject() {
    return {
      owner: this.owner,
      uuid: this.uuid,
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
