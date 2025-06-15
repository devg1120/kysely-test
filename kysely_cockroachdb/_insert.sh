

#sqlite3 ./sqlite/exercise.sqlite3 < ./sql/_INSERT.sql
#psql -d testdb3 -U test -f ./sql/_INSERT.sql
cockroach sql  --certs-dir=certs --host=localhost:26257 -d testdb1 -u test -f ./sql/_INSERT.sql 

