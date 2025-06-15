CREATE TYPE type_composite AS (
    i INTEGER,
    j TEXT
);

CREATE TABLE foo
(
    col_serial                 SERIAL                   NOT NULL,
    col_bigserial              BIGSERIAL                NOT NULL,
    col_boolean                BOOLEAN                  NOT NULL,
    col_boolean_null           BOOLEAN,
    col_smallint               SMALLINT                 NOT NULL,
    col_smallint_null          SMALLINT,
    col_int                    INTEGER                  NOT NULL,
    col_int_null               INTEGER,
    col_bigint                 BIGINT                   NOT NULL,
    col_bigint_null            BIGINT,
    col_numeric                NUMERIC                  NOT NULL,
    col_numeric_null           NUMERIC,
    col_real                   REAL                     NOT NULL,
    col_real_null              REAL,
    col_double                 DOUBLE PRECISION         NOT NULL,
    col_double_null            DOUBLE PRECISION,
    col_text                   TEXT                     NOT NULL,
    col_text_null              TEXT,
    col_char                   CHAR(1)                  NOT NULL,
    col_char_null              CHAR(1),
    col_date                   DATE                     NOT NULL,
    col_date_null              DATE,
    col_time_with              TIME WITH TIME ZONE      NOT NULL,
    col_time_with_null         TIME WITH TIME ZONE,
    col_time                   TIME                     NOT NULL,
    col_time_null              TIME,
    col_timestamp_with         TIMESTAMP WITH TIME ZONE NOT NULL,
    col_timestamp_with_null    TIMESTAMP WITH TIME ZONE,
    col_timestamp              TIMESTAMP                NOT NULL,
    col_timestamp_null         TIMESTAMP,
    col_uuid                   UUID                     NOT NULL,
    col_uuid_null              UUID,
    col_json                   JSONB                    NOT NULL,
    col_json_null              JSONB,
    col_array                  INTEGER[]                NOT NULL,
    col_array_null             INTEGER[],
    col_composite              type_composite           NOT NULL,
    col_composite_null         type_composite,
    col_composite_array        type_composite[]         NOT NULL,
    col_composite_array_null   type_composite[]
);

