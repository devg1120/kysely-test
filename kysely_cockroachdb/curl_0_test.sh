

echo ----------------------------------------------- TEST1  /posts/:id
curl  -X "GET" -G  -d page=3  "http://127.0.0.1:3000/posts/:98765?param1=1919&param2=value2" 
echo
echo ----------------------------------------------- TEST2  /posts/:id
curl  -X 'GET' -G \
  'http://127.0.0.1:3000/posts/:9999' \
  -H 'accept: application/json' \
  -H 'X-Wagby-Authorization: ログオンアカウントとパスワード' \
  -H 'Content-Type: application/json' \
  -d  page=11111
echo
echo ----------------------------------------------- TEST3  /api
curl  -X "GET" http://127.0.0.1:3000/api?method=flickr.photos.search\&api_key=ABCDEFG
echo
echo ----------------------------------------------- TEST4  /api  
curl  -X "GET" http://127.0.0.1:3000/api?method=flickr.photos.search\&api_key=ABCDEFG
echo
echo ----------------------------------------------- TEST5  /api  json

ENDPOINT="http://127.0.0.1:3000/api/v1/users"
JSON1='{"name":"佐藤", "email":"john@example.com"}'
JSON2='{"name":"John", "email":"john@example.com"}'
JSON3='{"name":"John2", "email":"john@example.com"}'

#curl -X POST http://127.0.0.1:3000/api/v1/users -H 'Content-Type: application/json' -d '{"name":"John", "email":"john@example.com"}'
#curl -X POST http://127.0.0.1:3000/api/v1/users -H 'Content-Type: application/json' -d "${JSON1}"
curl  -X POST ${ENDPOINT}  -H 'Content-Type: application/json' -d "${JSON3}"
echo

echo ----------------------------------------------- TEST5  /api  json-file

ENDPOINT="http://127.0.0.1:3000/api/v1/users"
JSONFILE=./request.json
#curl  -X POST ${ENDPOINT} --data @./request.json  -H 'Content-Type: application/json' 
curl  -X POST ${ENDPOINT} --data @${JSONFILE}  -H 'Content-Type: application/json' 

echo
