import {validateJwt} from "https://deno.land/x/djwt/validate.ts";
import {makeJwt, setExpiration, Jose, Payload} from "https://deno.land/x/djwt/create.ts";
import {Cookies} from 'https://deno.land/x/oak@v6.3.1/mod.ts';

export class Auth {
    static async generateJwt(id: any) {
        const key = Deno.env.get('key') || '';
        const payload: Payload = {
            iss: id,
            exp: setExpiration(60 * 60),
        };

        const header: Jose = {
            alg: "HS256",
            typ: "JWT",
        };

        return await makeJwt({header, payload, key});
    }

    static async validateJwt(cookies: Cookies) {
        const jwt = cookies.get('jwt');

        if (jwt) {
            const key = Deno.env.get('key') || '';

            return await validateJwt({jwt, key, algorithm: 'HS256'});
        }

        return {
            isValid: false
        };
    }

    static async issuer(cookies: Cookies) {
        const data: any = await this.validateJwt(cookies);

        if (!data.isValid) {
            return null;
        }

        return data.payload.iss;
    }
}
