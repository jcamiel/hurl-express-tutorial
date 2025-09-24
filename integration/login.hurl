GET {{host}}
HTTP 200


# Try to access my movies, we're not authenticated and redirected to
# the login page.
GET {{host}}/my-movies
HTTP 302
[Asserts]
header "Location" == "/login"


# First, display the login page to capture
# the CSRF token (see https://en.wikipedia.org/wiki/Cross-site_request_forgery)
GET {{host}}/login
HTTP 200
[Captures]
csrf_token: xpath "string(//input[@name='_csrf']/@value)"


# Log in user, using the captured CSRF token. After
# successful login, we should be redirected to the favorites page.
POST {{host}}/login
[Form]
_csrf: {{csrf_token}}
username: bob78
password: 12345678
HTTP 302
[Asserts]
header "Location" == "/my-movies"


# Follow redirection and open favorites:
GET {{host}}/my-movies
HTTP 200
[Asserts]
body contains "Bob"


# Logout
GET {{host}}/logout
HTTP 302
[Asserts]
header "Location" == "/"


# Test that user is not logged
GET {{host}}/my-movies
HTTP 302
[Asserts]
header "Location" == "/login"


# If we try to log with a bad password, we should be redirected
# to the login page with a warning message. Instead of follow redirection
# by hand, we're using location option to follow redirection and go the the
# final page.

# Capture the CSRF token
GET {{host}}/login
HTTP 200
[Captures]
csrf_token: xpath "string(//input[@name='_csrf']/@value)"

# Log in with bad password.
POST {{host}}/login
[Options]
location: true
[Form]
_csrf: {{csrf_token}}
username: bob78
password: bad-password
HTTP 200
[Asserts]
url == "{{host}}/login"
xpath "string(//div[contains(@class, 'text-error')])" == "Authentication failed, please check your username and password"


# Check that CSRF token is mandatory:
POST {{host}}/login
[Form]
username: bob78
password: 12345678
HTTP 403
