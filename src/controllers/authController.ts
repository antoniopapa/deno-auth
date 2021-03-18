import {Context} from 'https://deno.land/x/oak@v6.3.1/mod.ts';
import {hashSync, compareSync} from 'https://deno.land/x/bcrypt@v0.2.4/mod.ts';
import {UserRepository} from "../repositories/userRepository.ts";
import {Auth} from "../helpers/auth.ts";
import {User} from "../models/user.ts";

export const Register = async (ctx: Context) => {
    const req = await ctx.request.body().value;

    const repository = new UserRepository();

    await repository.create({
        first_name: req.first_name,
        last_name: req.last_name,
        email: req.email,
        password: hashSync(req.password),
    });

    ctx.response.body = {
        message: 'Success'
    };
}

export const Login = async ({request, response, cookies}: Context) => {
    const req = await request.body().value;

    const repository = new UserRepository();

    const result: any = await repository.findBy('email', req.email);

    if (result.length === 0) {
        response.status = 404;
        response.body = {
            message: 'User not found!'
        }
        return;
    }

    const user = new User(result[0]);

    if (!compareSync(req.password, user.password)) {
        response.status = 401;
        response.body = {
            message: 'Incorrect password!'
        }
        return;
    }

    const jwt = await Auth.generateJwt(user.id);

    cookies.set('jwt', jwt, {httpOnly: true});

    response.body = {
        jwt
    }
}

export const Me = async ({response, cookies}: Context) => {
    const userId = await Auth.issuer(cookies);

    const repository = new UserRepository();

    const result = await repository.find(userId);

    const user = new User(result);

    response.body = user.json();
}

export const Logout = async ({response, cookies}: Context) => {
    cookies.delete('jwt');

    response.body = {
        message: 'Success'
    }
}
