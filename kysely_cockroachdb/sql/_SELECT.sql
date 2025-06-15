SELECT
    col_text,
    col_text_null,
    col_int,
    col_int_null,
    col_real,
    col_real_null
   -- STRFTIME('%Y-%m-%dT%H:%M:%fZ', col_timestamp) AS col_timestamp,
   -- STRFTIME('%Y-%m-%dT%H:%M:%fZ', col_timestamp_null) AS col_timestamp_null
FROM
    foo;
