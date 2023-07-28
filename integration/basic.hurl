# First, open our home page and perform some checks
# on the HTML content and on the server response.
GET {{host}}
HTTP 200
[Asserts]
xpath "string(//head/title)" == "Movies Box"
xpath "//h3" count == 2
xpath "string((//h3)[1])" contains "Popular"
xpath "string((//h3)[2])" contains "Featured Today"
# Testing HTTP response headers:
header "Content-Type" == "text/html; charset=utf-8"
cookie "x-session-id" exists
cookie "x-session-id[HttpOnly]" exists
cookie "x-session-id[SameSite]" == "Strict"
# Check we don't leak information about using Express
header "X-Powered-By" not exists


# Check that we don't recreate a new session
GET {{host}}
HTTP 200
[Asserts]
cookie "x-session-id" not exists


# Check that we have a 404 response for broken links:
GET {{host}}/not-found
HTTP 404
[Asserts]
header "Content-Type" == "text/html; charset=utf-8"
xpath "string(//h2)" == "Error"
xpath "string(//h3)" == "Not Found"


# We test alos our Heath REST api to see if our server is OK.
GET {{host}}/api/health
HTTP 200
[Asserts]
header "Content-Type" == "application/json; charset=utf-8"
jsonpath "$.status" == "RUNNING"
jsonpath "$.healthy" == true
jsonpath "$.operationId" exists
