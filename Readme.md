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

## Ep11 : Router

- Separate the all apis from app.js into different routers
- Creating grpuping of apis
- Listed all the apis in apiList.md

## Ep 12 Index DB Query and compound index

- Compund Index [text](https://www.mongodb.com/docs/manual/core/indexes/index-types/index-compound/)
- Created connnectionRequest schema to store connection request
- Covered corner cases in send connection api
- Used 'pre' schema hook for schema validation
- Mongo db 'or' query used to compare two condition when doing findOne
- Why we need index in DB?
- Advantages & Disadvantages of indexing

## Ep 13 Review request

- Create review request api (find record id , if status is interested and then update the status)
- Create ref (relation) between two models
- Populate [map other collection] (https://mongoosejs.com/docs/populate.html)
- or mongo query const connectionRequests = await ConnectionRequest.find({
  $or: [
  { fromUserId: loggedInUser._id, status: "accepted" },
  { toUserId: loggedInUser._id, status: "accepted" },
  ],
  })

## Ep 14 Feed Api and Pagination
- 0-Not see his own profile
- 1-user's own connections
- 2-ignored users
- 3-already sent connection request
- Explored mongo $ne (not equal), $and (for and condition) , $nin (not in Array)
- Adding Pagination to /user/feed api
- /user/feed?page=1&limit=10
- using skip and limit mongo function