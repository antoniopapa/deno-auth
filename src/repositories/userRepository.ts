import {Repository} from "./repository.ts";

export class UserRepository extends Repository {
    get table(): string {
        return "users";
    }

}
