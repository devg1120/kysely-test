import {serve} from '@hono/node-server'
import {Hono} from 'hono'
import {Kysely, PostgresDialect, sql} from "kysely"
//import {DB} from "kysely-codegen"
import type { DB }  from "./db_types.ts"
//const SQLite = require("better-sqlite3");
//import SQLite from "better-sqlite3";
import {Pool} from "pg"

/*
export interface Foo {
  col_int: number;
  col_int_null: number | null;
  col_real: number;
  col_real_null: number | null;
  col_text: string;
  col_text_null: string | null;
  col_timestamp: number;
  col_timestamp_null: number | null;
}

export interface DB {
  foo: Foo;
}
*/

const dialect = new PostgresDialect({
    pool: new Pool({
        host: "localhost",
        port: 5432,
        user: "test",
        password: "test",
        database: "testdb3",
    })
})
export const db = new Kysely<DB>({
    dialect,
    log: (event) => {
        if (event.level === "query") {
            console.log(event.query.sql)
            console.log(event.query.parameters)
        }
    }
})

const app = new Hono()
app.notFound((c) => c.json({message: "Not Found", ok: false}, 404))

app.get('/posts/:id', (c) => {
  // クエリパラメーターpageを取得
  const page = c.req.query('page')
  const param1 = c.req.query('param1')
  const param2 = c.req.query('param2')

  // パスパラメーターidを取得
  const id = c.req.param('id')

  // ヘッダーを設定
  c.header('X-Message', 'Hi!')
  
  return c.text(`/post/:id  page:${page} id:${id} ${param1} ${param2}\n`)
})


app.get('/api', (c) => {
  // クエリパラメーターpageを取得
  const key = c.req.query('api_key')
  const method = c.req.query('method')
  
  return c.text(`/api api-key:${key}  method:${method} \n`)
})
 
app.post('/api/v1/users', async (c) => {
  const json =  await c.req.json()
   console.log(json)

  return c.text(`/api/v1/users : OK  ${JSON.stringify(json)}\n`)
})

app.get("/api/selectFoo", async (c) => {
    const resultSet = await db
        .selectFrom("foo")
        .select([
            sql`col_text`.as("colText"),
            sql`col_text_null`.as("colTextNull"),
            sql`CAST(col_int AS TEXT)`.as("colInt"),
            sql`CAST(col_int_null AS TEXT)`.as("colIntNull"),
            sql`col_real`.as("colReal"),
            sql`col_real_null`.as("colRealNull"),
            //sql`STRFTIME('%Y-%m-%dT%H:%M:%fZ', col_timestamp)`.as("colTimestamp"),
            //sql`STRFTIME('%Y-%m-%dT%H:%M:%fZ', col_timestamp_null)`.as("colTimestampNull"),
        ])
        .execute()
    return c.json(resultSet)
})

app.put("/api/updateFoo", async (c) => {
    await db.updateTable("foo")
        .set({
            col_text_null: "ABC",
        })
        .where("col_text_null", "is", null)
        .execute()

    return c.json({message: "ok", ok: true})
})

app.post("/api/insertFoo", async (c) => {
    await db.insertInto("foo")
        .values({
            col_text: "XYZ",
            col_text_null: null,
            col_int: 123,
            col_int_null: null,
            col_real: 3.14,
            col_real_null: null
            //col_timestamp: sql`JULIANDAY('now')`,
            //col_timestamp_null: null
        })
        .execute()

    return c.json({message: "ok", ok: true})
})

app.delete("/api/deleteFoo", async (c) => {
    await db.deleteFrom("foo")
        .where("col_text", "=", "XYZ")
        .execute()

    return c.json({message: "ok", ok: true})
})

const port = 3000
console.log(`Server is running on port ${port}`)

serve({
    fetch: app.fetch,
    port
})

