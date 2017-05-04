export class User {
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
    isAdmin: boolean;
    createdAt: string;
    updatedAt: string;

    constructor() {
        this.uuid = '';
        this.name = '';
        this.firstname = '';
        this.lastname = '';
        this.pictureUrl = '';
        this.email = '';
        this.role = '';
        this.reputation = 0;
        this.accountIsActive = false;
        this.xsrfToken = '';
        this.isAdmin = false;
        this.createdAt = '';
        this.updatedAt = '';
    }

}