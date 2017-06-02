# Authentication Process

When a user enters a username and password in the `/auth` route, that information is verified against the `Users` table in the middle-layer database. This table contains the usernames and their encrypted password. Once the user is authenticated, the application sends back a token that can be used for any of the API routes. The token is valid for two hours. Note that only userrole ‘admin’ has permission to access all routes; userrole ‘user’ does not currently have permission to access any routes.

## How It Works

A separate route, `/auth`, was created to generate a token. This token-based authentication is handled using four `npm` modules: 

- `Passport`, the authentication middleware
- `passport-local`
- `bcrypt-nodejs`
- `jsonwebtoken`

This API uses the `passport-local` strategy. This strategy authenticates users with a username and password and verifies that information against the database. When the user enters a username and password, the `bcrypt-nodejs` module verifies the submitted password against the hash in the database. Upon successful authentication, the application sends back a token using the `jsonwebtoken` module. The `jsonwebtoken` module uses a secret key, stored as an environment variable, to generate the token, which is set to be valid for 120 minutes.
