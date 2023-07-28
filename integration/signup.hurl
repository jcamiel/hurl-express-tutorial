# First we obtain an available username:
GET {{host}}/api/usernames/available
HTTP 200
[Captures]
username: jsonpath "$.username"


# Create a new valid user: get the CSRF token the signup:
GET {{host}}/signup
HTTP 200
[Captures]
csrf_token: xpath "string(//input[@name='_csrf']/@value)"
[Asserts]
xpath "//comment" count == 0     # Check that we don't leak comments


POST {{host}}/signup
[Options]
location: true
[FormParams]
_csrf: {{csrf_token}}
username: {{username}}
name: Bob
email: {{username}}@example.net
password: 12345678
HTTP 200
[Asserts]
url endsWith "/my-movies"


# Play some checks on signup form: username too short
# email already taken, invalid pattern for username
GET {{host}}/signup
HTTP 200
[Captures]
csrf_token: xpath "string(//input[@name='_csrf']/@value)"


# Create a new user, username too short
POST {{host}}/signup
[Options]
location: true
[FormParams]
_csrf: {{csrf_token}}
username: bo
name: Bob
email: bob78@example.net
password: 12345678
HTTP 200
[Asserts]
url endsWith "/signup"
xpath "string(//div[@class='form-errors'])" contains "Username must be 3 to 32 chars long"


# Create a new user, email already taken
GET {{host}}/signup
HTTP 200
[Captures]
csrf_token: xpath "string(//input[@name='_csrf']/@value)"


POST {{host}}/signup
[Options]
location: true
[FormParams]
_csrf: {{csrf_token}}
username: bob33
name: Bob
email: bob78@example.net
password: 12345678
HTTP 200
[Asserts]
url endsWith "/signup"
xpath "string(//div[@class='form-errors'])" contains "E-mail already in use"


# Create a new user, invalid username pattern
GET {{host}}/signup
HTTP 200
[Captures]
csrf_token: xpath "string(//input[@name='_csrf']/@value)"


POST {{host}}/signup
[Options]
location: true
[FormParams]
_csrf: {{csrf_token}}
username: SELECT * FROM users;
name: Bob
email: foo@example.net
password: 12345678
HTTP 200
[Asserts]
url endsWith "/signup"
xpath "string(//div[@class='form-errors'])" contains "Username must use a-z, A-Z, 0-9 or _ -"


# Test CSRF is mandatory:
POST {{host}}/signup
[FormParams]
username: bob
name: Bob
email: bob78@example.net
password: 12345678
HTTP 403
