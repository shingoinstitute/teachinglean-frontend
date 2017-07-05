
export class User implements UserInterface {
    uuid;
    firstname;
    lastname;
    _username;
    pictureUrl;
    email;
    verifiedEmail;
    biography;
    organization;
    role;
    reputation;
    accountIsActive;
    createdAt;
    updatedAt;
    lastLogin;

    get name() {
      if (this.firstname && this.lastname) {
        return `${this.firstname} ${this.lastname}`;
      } else if (this.firstname && !this.lastname) {
        return this.firstname;
      } else if (this.lastname && !this.firstname) {
        return this.lastname
      }
      return ""
    }

    get username() {
      return this._username && this._username.length > 0 ? this._username : this.name;
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
      user.verifiedEmail = !!data.verifiedEmail || false;
      user.role = data.role || "member";
      if (!data.pictureUrl.includes('cloudinary') && !data.pictureUrl.includes('silhouette')) {
        user.pictureUrl = data.pictureUrl || user.pictureUrl;
      }
      user.biography = data.bio || user.biography;
      user.organization = data.organization || "";
      user.reputation = data.reputation;
      user.accountIsActive = data.accountIsActive;
      user.createdAt = new Date(data.createdAt);
      user.updatedAt = new Date(data.updatedAt);
      user.lastLogin = new Date(data.lastLogin);

      return user;
    }

    lastLoginToString() {
      if (this.lastLogin) {
        let lastLogin = new Date(this.lastLogin);
        return `${lastLogin.toLocaleDateString([], {month: "short", day: "numeric", year: "numeric"})}, ${lastLogin.toLocaleTimeString([], {"hour": "2-digit", "minute": "2-digit", "hour12": true})}`;
      }
      return "n/a"
    }

    getLastLogin() {
      return this.lastLoginToString();
    }

    toObject() {
      return {
        uuid: this.uuid,
        firstname: this.firstname,
        lastname: this.lastname,
        username: this.username,
        email: this.email,
        verifiedEmail: !!this.verifiedEmail ? this.email : "",
        role: this.role,
        pictureUrl: this.pictureUrl,
        reputation: this.reputation,
        accountIsActive: this.accountIsActive,
        organization: this.organization,
        bio: this.biography
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
  verifiedEmail: boolean;
  role: string;
  biography: string;
  reputation: number;
  accountIsActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  lastLogin?: any;
}
