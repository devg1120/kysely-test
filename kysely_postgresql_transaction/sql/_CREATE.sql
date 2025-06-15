CREATE TABLE cities (
        name     TEXT  PRIMARY KEY,
        location TEXT
);

CREATE TABLE weather (
        city      TEXT REFERENCES CITIES(name),
        temp_lo   INT,           -- 最低気温
        temp_hi   INT,           -- 最高気温
        prcp      REAL,          -- 降水量
        date      TEXT
);

