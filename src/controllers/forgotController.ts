import {Context} from 'https://deno.land/x/oak@v6.3.1/mod.ts';
import cstring from 'https://deno.land/x/cstring/mod.js'
import {PasswordRepository} from "../repositories/passwordRepository.ts";
import {Mailer} from "../helpers/mailer.ts";
import {UserRepository} from "../repositories/userRepository.ts";
import {User} from "../models/user.ts";
import {hashSync} from 'https://deno.land/x/bcrypt@v0.2.4/mod.ts';

export const Forgot = async ({request, response}: Context) => {
    const req = await request.body().value;

    const email = req.email;
    const token = cstring(12);

    const repository = new PasswordRepository();

    await repository.create({
        email,
        token
    });

    const subject = 'Reset Your Password';

    const url = `${Deno.env.get('frontend')}/reset/${token}`;
    const content = `Click <a href="${url}" >here</a> to reset your password!`;

    await Mailer.send(email, subject, content);

    response.body = {
        message: 'Check your email'
    };
}

export const Reset = async ({request, response}: Context) => {
    const req = await request.body().value;

    if (req.password !== req.password_confirm) {
        response.status = 400;
        response.body = {
            message: 'Passwords do not match!'
        };
        return;
    }

    const passwordRepository = new PasswordRepository();

    const result: any = await passwordRepository.findBy('token', req.token);

    if (result.length === 0) {
        response.status = 400;
        response.body = {
            message: 'Invalid token!'
        };
        return;
    }

    const email = result[0].email;

    const userRepository = new UserRepository();

    const userResult: any = await userRepository.findBy('email', email);

    if (userResult.length === 0) {
        response.status = 404;
        response.body = {
            message: 'User does not exist!'
        };
        return;
    }

    const user = new User(userResult[0]);

    const password = hashSync(req.password);

    await userRepository.update(user.id, {password});

    response.body = {
        message: 'Success'
    }
}
