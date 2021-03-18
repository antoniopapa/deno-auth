import {connect} from 'https://deno.land/x/cotton@v0.7.3/mod.ts';

export abstract class Repository {
    abstract get table(): string;

    async client() {
        return await connect({
            "type": "mysql",
            "port": 3306,
            "database": "auth",
            "hostname": "localhost",
            "username": "root",
            "password": "rootroot"
        });
    }

    async find(id: any) {
        const result = await this.findBy('id', id);

        if (result.length === 0) {
            return null;
        }

        return result[0];
    }

    async findBy(key: string, value: any) {
        const db = await this.client();

        return await db.table(this.table).where(key, value).execute();
    }

    async create(data: any) {
        const db = await this.client();

        return await db.table(this.table).insert(data).execute();
    }

    async update(id: any, data: any) {
        const db = await this.client();

        return await db.table(this.table).where('id', id).update(data).execute();
    }
}
