import {Context} from 'https://deno.land/x/oak@v6.3.1/mod.ts';
import {Auth} from "../helpers/auth.ts";

export const authMiddleware = async ({cookies, response}: Context, next: Function) => {
    const data: { isValid: boolean } = await Auth.validateJwt(cookies);

    if (!data.isValid) {
        response.status = 401;
        response.body = {
            message: 'Unauthenticated'
        };
        return;
    }

    await next();
}
