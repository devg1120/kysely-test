import {serve} from '@hono/node-server'
import {Hono} from 'hono'
import {Kysely, SqliteDialect, sql} from "kysely"
//import {DB} from "kysely-codegen"
import type { DB }  from "./db_types.ts"
//const SQLite = require("better-sqlite3");
import SQLite from "better-sqlite3";

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

const dialect = new SqliteDialect({
    //database: new SQLite("/home/user/DataGripProjects/sqlite/exercise.sqlite3"),
    database: new SQLite("./sqlite/exercise.sqlite3"),
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
            sql`STRFTIME('%Y-%m-%dT%H:%M:%fZ', col_timestamp)`.as("colTimestamp"),
            sql`STRFTIME('%Y-%m-%dT%H:%M:%fZ', col_timestamp_null)`.as("colTimestampNull"),
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
            col_real_null: null,
            col_timestamp: sql`JULIANDAY('now')`,
            col_timestamp_null: null
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


/*
app.get("/api/selectFoo", async (c) => {
    const resultSet = await db
        .selectFrom("foo")
        .select([
            //sql`col_boolean`.as("colBoolean"),
            //sql`col_boolean_null`.as("colBooleanNull"),
            //sql`col_smallint`.as("colSmallint"),
            //sql`col_smallint_null`.as("colSmallintNull"),
            //sql`col_int`.as("colInt"),
            //sql`col_int_null`.as("colIntNull"),
            //sql`col_bigint`.as("colBigint"),
            //sql`col_bigint_null`.as("colBigintNull"),
            //sql`col_numeric`.as("colNumeric"),
            //sql`col_numeric_null`.as("colNumericNull"),
            //sql`col_real`.as("colReal"),
            //sql`col_real_null`.as("colRealNull"),
            //sql`col_double`.as("colDouble"),
            //sql`col_double_null`.as("colDoubleNull"),
            //sql`col_text`.as("colText"),
            //sql`col_text_null`.as("colTextNull"),
            //sql`col_char`.as("colChar"),
            //sql`col_char_null`.as("colCharNull"),
            //sql`CAST(col_date AS TEXT)`.as("colDate"),
            //sql`CAST(col_date_null AS TEXT)`.as("colDateNull"),
            //sql`col_time_with`.as("colTimeWith"),
            //sql`col_time_with_null`.as("colTimeWithNull"),
            //sql`col_time`.as("colTime"),
            //sql`col_time_null`.as("colTimeNull"),
            //sql`col_timestamp_with`.as("colTimestampWith"),
            //sql`col_timestamp_with_null`.as("colTimestampWithNull"),
            //sql`CAST(col_timestamp AS TEXT)`.as("colTimestamp"),
            //sql`CAST(col_timestamp_null AS TEXT)`.as("colTimestampNull"),
            //sql`col_uuid`.as("colUuid"),
            //sql`col_uuid_null`.as("colUuidNull"),
            //sql`col_json`.as("colJson"),
            //sql`col_json_null`.as("colJsonNull"),
            //sql`col_array`.as("colArray"),
            //sql`col_array_null`.as("colArrayNull"),
            //sql`TO_JSONB(col_composite)`.as("colComposite"),
            //sql`TO_JSONB(col_composite_null)`.as("colCompositeNull"),
            //sql`TO_JSONB(col_composite_array)`.as("colCompositeArray"),
            //sql`TO_JSONB(col_composite_array_null)`.as("colCompositeArrayNull"),
        ])
        .execute()
    return c.json(resultSet)
})

app.put("/api/updateFoo", async (c) => {
    await db.updateTable("foo")
        .set({
            col_json: sql`${{a: 777, b: null, c: "Hello"}}::JSONB`,
            col_json_null: sql`'{}'::JSONB`,
            col_array: sql`ARRAY[${111}, ${null}, ${333}]::INTEGER[]`,
            col_array_null: [444, 555, 666],
            col_composite: sql`ROW(${222}, ${null})::type_composite`,
            col_composite_array: sql`ARRAY[${null}, ROW(${111}, ${"Hello"})]::type_composite[]`,
        })
        .where("col_serial", "=", 1)
        .execute()

    return c.json({message: "ok", ok: true})
})

app.post("/api/insertFoo", async (c) => {
    await db.insertInto("foo")
        .values({
            col_boolean: false,
            col_boolean_null: null,
            col_smallint: 9999,
            col_smallint_null: null,
            col_int: 999999999,
            col_int_null: null,
            col_bigint: 999999999999999999n,
            col_bigint_null: null,
            col_numeric: "2.718281828459045235360287471352662497757247093699959574966967627724076630353547594571382178",
            col_numeric_null: null,
            col_real: 2.71828182845904523536028747135266,
            col_real_null: null,
            col_double: 2.71828182845904523536028747135266,
            col_double_null: null,
            col_text: "Hello",
            col_text_null: null,
            col_char: "z",
            col_char_null: null,
            col_date: "2024-01-21",
            col_date_null: null,
            col_time_with: "13:00",
            col_time_with_null: null,
            col_time: "13:00",
            col_time_null: null,
            col_timestamp_with: "2024-01-21 13:00:00.000000",
            col_timestamp_with_null: null,
            col_timestamp: "2024-01-21 13:00:00.000000",
            col_timestamp_null: null,
            col_uuid: sql`GEN_RANDOM_UUID()`,
            col_uuid_null: null,
            col_json: sql`${{a: 777, b: null, c: "Hello"}}::JSONB`,
            col_json_null: sql`${{}}::JSONB`,
            col_array: sql`ARRAY[${111}, ${null}, ${333}]::INTEGER[]`,
            col_array_null: [444, 555, 666],
            col_composite: sql`ROW(${222}, ${null})::type_composite`,
            col_composite_null: null,
            col_composite_array: sql`ARRAY[${null}, ROW(${111}, ${"Hello"})]::type_composite[]`,
            col_composite_array_null: null,
        })
        .execute()

    return c.json({message: "ok", ok: true})
})

app.delete("/api/deleteFoo", async (c) => {
    const subQuery = db
        .selectFrom("foo")
        .select(({fn}) =>
            [
                fn.max("col_serial")
            ]
        )
    await db.deleteFrom("foo")
        .where("col_serial", "=", subQuery)
        .execute()

    return c.json({message: "ok", ok: true})
})
*/

const port = 3000
console.log(`Server is running on port ${port}`)

serve({
    fetch: app.fetch,
    port
})

