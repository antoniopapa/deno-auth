import {SmtpClient} from "https://deno.land/x/smtp/mod.ts";

export class Mailer {
    static async send(to: string, subject: string, content: string) {
        const client = new SmtpClient();

        await client.connect({
            hostname: "0.0.0.0",
            port: 1025,
        });

        await client.send({
            from: "antonio@email.com",
            to,
            subject,
            content,
        });

        await client.close();
    }
}
