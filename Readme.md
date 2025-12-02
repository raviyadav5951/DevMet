- Middleware to separate the routes
- next() to process to next code 
- E.g Admin routes or protected routes
- Error handing at the end

## Ep 6 DB schema and models

- Mongoose doc [text](https://mongoosejs.com/docs/guide.html)
- Creating schema first and then creating model
- CRUD api methods
- Env setup

## Ep 8 DB schema validation checks

- Adding validations on model : required,unique check
- Schema types: min ,minLength
- Custom validators by default run when inserting new document
- To run gender validator on patch/update then we have to enable it.
- DB schema validations on fields
- Added timestamps on schema
- Added schema validation for email using validator.js npm library
- NEVER TRUST req.body (always add schema or api level validation)

## Ep9 Password encruption

- Using bcrypt for password encryption

## Ep10 JWT,Cookie
- JWT using npm package [text](https://www.npmjs.com/package/jsonwebtoken)
- Cookie parser using middleware [text](https://www.npmjs.com/package/cookie-parser)
- First send signed JWT on succesful login
- On every api create auth middleware to first verify token before proceeding
- We can set expiry on cookie , also we can create expiresIn for JWT token [(0d) to simulate ]

