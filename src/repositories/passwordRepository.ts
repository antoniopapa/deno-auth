import {Repository} from "./repository.ts";

export class PasswordRepository extends Repository {
    get table(): string {
        return "password_reset";
    }

}
