# Favorites api is authenticated
PUT {{host}}/api/favorites
{
    "selected": true,
    "movie_id": "dune-1984"
}
HTTP 401


# Create a user.
# First we obtain an available username
GET {{host}}/api/usernames/available
HTTP 200
[Captures]
username: jsonpath "$.username"


# We open the signup page to capture the CSRF token.
GET {{host}}/signup
HTTP 200
[Captures]
csrf_token: xpath "string(//input[@name='_csrf']/@value)"


# Sign up!
POST {{host}}/signup
[FormParams]
_csrf: {{csrf_token}}
username: {{username}}
name: Bob
email: {{username}}@example.net
password: 12345678
HTTP 302
[Asserts]
header "Location" == "/my-movies"


# Test that have 0 favorites yet
GET {{host}}/my-movies
HTTP 200
[Asserts]
xpath "//li[@class='favorite-movie']" count == 0


# Now we can use authenticated API, add some good movies to
# our favorites list.
PUT {{host}}/api/favorites
{
    "selected": true,
    "movie_id": "dune-1984"
}
HTTP 200
[Asserts]
jsonpath "$.selected" == true


PUT {{host}}/api/favorites
{
    "selected": true,
    "movie_id": "the-dark-crystal"
}
HTTP 200
[Asserts]
jsonpath "$.selected" == true


# Now, we can test that have 2 favorites movies
GET {{host}}/my-movies
HTTP 200
[Asserts]
xpath "//li[@class='favorite-movie']" count == 2


# Delete one favorite
PUT {{host}}/api/favorites
{
    "selected": false,
    "movie_id": "the-dark-crystal"
}
HTTP 200
[Asserts]
jsonpath "$.selected" == false


# Test that we have only one favorite in our list now
GET {{host}}/my-movies
HTTP 200
[Asserts]
xpath "//li[@class='favorite-movie']" count == 1
