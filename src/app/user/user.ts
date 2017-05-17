
export class User implements UserInterface {
    uuid;
    firstname;
    lastname;
    pictureUrl;
    email;
    role;
    reputation;
    accountIsActive;
    xsrfToken;
    createdAt;
    updatedAt;
    lastLogin;

    get name() {
      return this.firstname + ' ' + this.lastname;
    }

    get isAdmin() {
      return this.role === 'admin' || this.role === 'systemAdmin';
    }

    constructor() {
      this.uuid = '';
      this.firstname = '';
      this.lastname = '';
      this.email = '';
      this.xsrfToken = '';
      this.role = '';
      this.pictureUrl = '';
      this.reputation = 0;
      this.accountIsActive = false;
    }

    initFromObject(obj: any) {
      let data = obj.user;

      if (!data) {
        throw new Error('Could not parse user from object; obj.user is undefined');
      }

      this.xsrfToken = obj.token;

      this.uuid = data.uuid;
      this.firstname = data.firstname;
      this.lastname = data.lastname;
      this.email = data.email;
      this.role = data.role;
      this.pictureUrl = data.pictureUrl;
      this.reputation = data.reputation;
      this.accountIsActive = data.accountStatus;
      this.createdAt = Date.parse(data.createdAt);
      this.updatedAt = Date.parse(data.updatedAt);
      this.lastLogin = Date.parse(data.lastLogin);
    }

}

interface UserInterface {
  uuid: string;
  name: string;
  firstname: string;
  lastname: string;
  pictureUrl: string;
  email: string;
  role: string;
  reputation: number;
  accountIsActive: boolean;
  xsrfToken: string;
  createdAt?: Date;
  updatedAt?: Date;
  lastLogin?: Date;
}
