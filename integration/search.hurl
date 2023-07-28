GET {{host}}/api/search
HTTP 400


GET {{host}}/api/search
[QueryStringParams]
q: 1982
HTTP 200
[Asserts]
jsonpath "$" count == 5
jsonpath "$[0].name" == "Blade Runner"
jsonpath "$[0].director" == "Ridley Scott"
jsonpath "$[0].release_date" == "1982-06-25"


GET {{host}}/api/search
[QueryStringParams]
q: sean young
HTTP 200
[Asserts]
jsonpath "$" count == 2
jsonpath "$[1].name" == "Dune"
jsonpath "$[1].director" == "David Lynch"
jsonpath "$[1].release_date" == "1984-12-03"


# Verify that we don't have cache on search results
GET {{host}}/api/search
[QueryStringParams]
q: sean young
HTTP 200
[Asserts]
header "ETag" not exists
