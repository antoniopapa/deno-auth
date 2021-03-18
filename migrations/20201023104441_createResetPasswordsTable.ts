import {Schema} from "https://deno.land/x/cotton@v0.7.2/mod.ts";

export async function up(schema: Schema) {
    await schema.createTable('password_reset', (table) => {
        table.id();
        table.varchar('email');
        table.varchar('token');
    })
}

export async function down(schema: Schema) {
    await schema.dropTable('password_reset');
}
