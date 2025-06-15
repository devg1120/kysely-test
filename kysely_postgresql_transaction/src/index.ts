import {serve} from '@hono/node-server'
import {Hono} from 'hono'
import {Kysely, PostgresDialect, sql} from "kysely"
//import {DB} from "kysely-codegen"
import type { DB }  from "./db_types.ts"
//const SQLite = require("better-sqlite3");
//import SQLite from "better-sqlite3";
import {Pool} from "pg"

const dialect = new PostgresDialect({
    pool: new Pool({
        host: "localhost",
        port: 5432,
        user: "test",
        password: "test",
        database: "testdb4",
    })
})

//export const db = new Kysely<DB>({
//export const postgresDb = new Kysely<DB>({
export const db = new Kysely<DB>({
    dialect,
    log: (event) => {
        if (event.level === "query") {
            console.log(event.query.sql)
            console.log(event.query.parameters)
        }
    }
})

// PostgreSQLクエリー
const postgresTransaction = async (isGood: boolean) => {
    // トランザクション
    //await postgresDb.transaction().execute(async (tx) => {
    await db.transaction().execute(async (tx) => {
        // 親テーブルに1件UPSERT（INSERT ... ON CONFLICT）
        await tx.insertInto("cities")
            .values({
                name: "San Francisco",
                location: "(-194.0, 53.0)",
            })
            .onConflict((ocb) => ocb
                .column("name")
                .doUpdateSet({
                    location: (eb) => eb.ref("excluded.location")
                })
            )
            .execute()

        // 子テーブルに3件INSERT

        // 1件目
        await tx.insertInto("weather")
            .values({
                city: "San Francisco",
                temp_lo: 43,
                temp_hi: 57,
                prcp: 0.0,
                date: "2023-01-01",
            })
            .execute()

        // 2件目
        await tx.insertInto("weather")
            .values({
                city: "San Francisco",
                temp_lo: 43,
                temp_hi: 57,
                prcp: 0.0,
                date: "2023-01-02",
            })
            .execute()

        // 3件目のINSERTは、isGoodのときは成功させて、!isGoodのときは失敗させる
        let city
        if (isGood) {
            city = "San Francisco" // 親テーブルに存在する値を外部キーに設定
        } else {
            city = "Hayward" // 親テーブルに存在しない値を外部キーに設定
        }
        await tx.insertInto("weather")
            .values({
                city: city,
                temp_lo: 43,
                temp_hi: 57,
                prcp: 0.0,
                date: "2023-01-03",
            })
            .execute()
    })

    // トランザクションが成功したら、親テーブルと子テーブルをjoinして、結果表をレスポンスにして返す
    //return postgresDb
    return db
        .selectFrom("cities")
        .leftJoin("weather", "cities.name", "weather.city")
        .select([
            "cities.name",
            sql`weather.temp_lo`.as("tempLo"),
            sql`weather.temp_hi`.as("tempHi"),
            "weather.prcp",
            "weather.date",
        ])
        .orderBy("weather.date")
        .execute()
}

/*
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
*/

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

// PostgreSQL：成功するトランザクション
app.post("/postgres/good", async (c) => {
    try {
        const resultSet = await postgresTransaction(true)
        return c.json(resultSet)
    } catch (e) {
        return c.json({message: e.toString(), ok: false}, 500)
    }
})

// PostgreSQL：失敗するトランザクション
app.post("/postgres/bad", async (c) => {
    try {
        return c.json(await postgresTransaction(false))
    } catch (e) {
        return c.json({message: e.toString(), ok: false}, 500)
    }
})

const port = 3000
console.log(`Server is running on port ${port}`)

serve({
    fetch: app.fetch,
    port
})

