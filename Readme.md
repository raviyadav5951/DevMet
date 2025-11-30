- Middleware to separate the routes
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
