# URL UPTIME MONITOR

This is a RESTful API that monitors whether a url is up or down.

At the moment, here's how you can do the following:

this API uses a token for authentication

to register a user: send `{ name, email, password }` to **PUBLIC** `POST /api/users/register` 

to login: send `{ email, password }` to **PRIVATE** `POST /api/users/login`

to view your profile: make request to **PRIVATE** `GET /api/users/me`

to create a check: send `{ protocol, url, method, successCodes, timeoutSeconds }` to **PRIVATE** `POST /api/checks/create`

to get all checks for a particular user: make request to **PRIVATE** `GET /api/checks`

to update a check: send either of the following `{ protocol, url, method, successCodes, timeoutSeconds, state }` to **PRIVATE** `PUT /api/checks/:checkId`

to delete a check: make request to `DELETE /api/checks/:checkId`

---

Please note that the application relies a lot on background workers, and they are the meat of the application.