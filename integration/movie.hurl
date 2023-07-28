GET {{host}}/movies/dune-1984
HTTP 200
[Asserts]
xpath "normalize-space(//h2)" == "Dune (1984)"


GET {{host}}/movies/foo
HTTP 404
