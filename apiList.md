# DevTinder APIs

## authRouter

- POST /signup
- POST /login
- POST /logout

## profileRouter

- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password // Forgot password API

## connectionRequestRouter

- POST /request/send/:status/:userId
- POST /request/review/:{accepted/rejected}/:requestId (same api for both status)

## userRouter

- GET /user/connections (give my matches or my connections)
- GET /user/requests/received
- GET /user/feed - Gets you the profiles of other users on platform

Status: ignored, interested, accepeted, rejected
