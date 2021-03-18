export class User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    password: string;

    constructor(json: any) {
        this.id = json?.id;
        this.first_name = json?.first_name;
        this.last_name = json?.last_name;
        this.email = json?.email;
        this.password = json?.password;
    }

    json() {
        return {
            id: this.id,
            first_name: this.first_name,
            last_name: this.last_name,
            email: this.email,
        }
    }
}
