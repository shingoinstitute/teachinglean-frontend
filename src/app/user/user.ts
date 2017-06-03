
export class User implements UserInterface {
    uuid;
    firstname;
    lastname;
    _username;
    pictureUrl;
    email;
    biography;
    organization;
    role;
    reputation;
    accountIsActive;
    createdAt;
    updatedAt;
    lastLogin;

    get name() {
      return this.username;
    }

    get username() {
      return this._username.length > 0 ? this._username : this.name;
    }

    set username(username: string) {
      this._username = username;
    }

    get isAdmin() {
      return this.role === 'admin' || this.role === 'systemAdmin';
    }

    constructor() {
      this.uuid = '';
      this.firstname = '';
      this.lastname = '';
      this._username = '';
      this.email = '';
      this.role = '';
      this.biography = '<p class="grey-text"><i>Biography not entered.</i></p>';
      this.organization = '';
      this.pictureUrl = '/assets/images/silhouette_vzugec.png';
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
      user.firstname = data.firstname || "";
      user.lastname = data.lastname || "";
      user._username = data.username || "";
      user.email = data.email || "";
      user.role = data.role || "member";
      if (!data.pictureUrl.includes('cloudinary') && !data.pictureUrl.includes('silhouette')) {
        user.pictureUrl = data.pictureUrl || user.pictureUrl;
      }
      user.biography = data.bio || user.biography;
      user.organization = data.organization || "";
      user.reputation = data.reputation;
      user.accountIsActive = data.accountIsActive;
      user.createdAt = Date.parse(data.createdAt);
      user.updatedAt = Date.parse(data.updatedAt);
      user.lastLogin = Date.parse(data.lastLogin);

      return user;
    }

    lastLoginToString() {
      if (this.lastLogin) {
        let lastLogin = new Date(this.lastLogin);
        return `${lastLogin.toLocaleDateString([], {month: "short", day: "numeric", year: "numeric"})}, ${lastLogin.toLocaleTimeString([], {"hour": "2-digit", "minute": "2-digit", "hour12": true})}`;
      }
      return "n/a"
    }

    toObject() {
      return {
        uuid: this.uuid,
        firstname: this.firstname,
        lastname: this.lastname,
        username: this.username,
        email: this.email,
        role: this.role,
        pictureUrl: this.pictureUrl,
        reputation: this.reputation,
        accountIsActive: this.accountIsActive
      }
    }

}

interface UserInterface {
  uuid: string;
  name: string;
  firstname: string;
  lastname: string;
  username: string;
  organization: string;
  pictureUrl: string;
  email: string;
  role: string;
  biography: string;
  reputation: number;
  accountIsActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  lastLogin?: Date;
}
