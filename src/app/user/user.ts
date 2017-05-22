
export class User implements UserInterface {
    uuid;
    firstname;
    lastname;
    pictureUrl;
    email;
    role;
    reputation;
    accountIsActive;
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
      this.role = '';
      this.pictureUrl = '';
      this.reputation = 0;
      this.accountIsActive = false;
    }

    static initFromObject(obj: any) {
      let data = obj.user ? obj.user : obj;

      if (!data.uuid) {
        return undefined;
      }

      let user = new User();

      user.uuid = data.uuid;
      user.firstname = data.firstname;
      user.lastname = data.lastname;
      user.email = data.email;
      user.role = data.role;
      user.pictureUrl = data.pictureUrl;
      user.reputation = data.reputation;
      user.accountIsActive = data.accountStatus;
      user.createdAt = Date.parse(data.createdAt);
      user.updatedAt = Date.parse(data.updatedAt);
      user.lastLogin = Date.parse(data.lastLogin);

      return user;
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
  createdAt?: Date;
  updatedAt?: Date;
  lastLogin?: Date;
}
