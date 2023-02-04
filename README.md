# Production:
https://rp.cyclic.app/api/
# Routes:
### <u>Authentication</u> ---

**post**: `https://rp.cyclic.app/api/auth/register` - endpoint to registration

**post**: `https://rp.cyclic.app/api/auth/login` - endpoint to login

**get**: `https://rp.cyclic.app/api/auth/logout` - endpoint to logout

**get**: `https://rp.cyclic.app/api/auth/delete-account` - endpoint to delete an account

### <u>Fetching(requiring) some data from server</u> ---

**get**: `https://rp.cyclic.app/api/fetch/profile` - endpoint to fetch data about your profile

### <u>Editing some personal settings(color theme e.g.)</u> ---

**post**: `https://rp.cyclic.app/api/edit/theme` - endpoint to change your personal color theme 

# Server response cases:
## **post**: `https://rp.cyclic.app/api/auth/register`
### Status code : response:
 - 200 : `{message: "Success"}`
---
 - 400 : `{message: "Invalid credentials"}`
 - 405 : `{message: "Log out first"}`
 - 409 : `{message: "Already exists"}`
---
 - 500 : `{message: "Unexpected issue"}`
## **post**: `https://rp.cyclic.app/api/auth/login`
### Status code : response:
 - 200 : `{message: "Success"}`
 - 200 : `{message: "Already logged in"}`
---
 - 400 : `{message: "Wrong credentials"}`
 - 400 : `{message: "Has wrong cookie"}`
---
 - 500 : `{message: "Unexpected issue"}`
## **get**: `https://rp.cyclic.app/api/auth/logout`
### Status code : response:
- 200 : `{message: "Success"}`
- 200 : `{message: "Already logged out"}`
---
- 500 : `{message: "Unexpected issue"}`
## **get**: `https://rp.cyclic.app/api/auth/delete-account`
### Status code : response:
- 200 : `{message: "Success"}`
---
- 400 : `{message: "Has wrong cookie"}`
- 401 : `{message: "Log in first"}`
- 403 : `{message: "Session has expired. Log in again"}`
---
- 500 : `{message: "Unexpected issue"}`
## **get**: `https://rp.cyclic.app/api/fetch/profile`
### Status code : response:
- 200 : `user: IPublicUser`
---
- 400 : `{message: "Has wrong cookie"}`
- 401 : `{message: "Log in first"}`
- 403 : `{message: "Session has expires. Log in again"}`
---
- 500 : `{message: "Unexpected issue"}`
## **post**: `https://rp.cyclic.app/api/edit/theme`
### Status code : response:
- 200 : `{message: "Success"}`
---
- 400 : `{message: "Has wrong cookie"}`
- 400 : `{message: "Theme is not valid"}`
- 401 : `{message: "Log in first"}`
- 403 : `{message: "Session has expired. Log in again"}`
---
- 500 : `{message: "Unexpected issue"}`
- ## **post**: `https://rp.cyclic.app/api/edit/name`
### Status code : response:
- 200 : `{message: "Success"}`
---
- 400 : `{message: "Has wrong cookie"}`
- 400 : `{message: "The name is not valid"}`
- 401 : `{message: "Log in first"}`
- 403 : `{message: "Session has expired. Log in again"}`
---
- 500 : `{message: "Unexpected issue"}`
- ## **post**: `https://rp.cyclic.app/api/edit/lastname`
### Status code : response:
- 200 : `{message: "Success"}`
---
- 400 : `{message: "Has wrong cookie"}`
- 400 : `{message: "The name is not valid"}`
- 401 : `{message: "Log in first"}`
- 403 : `{message: "Session has expired. Log in again"}`
---
- 500 : `{message: "Unexpected issue"}`

# Links:
- RP client github: https://github.com/alex-sikach/rp
- Database Tables structure: https://app.diagrams.net