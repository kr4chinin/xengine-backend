# 🔩 XEngine Store Project - Backend

This is my full-stack e-commerce shop project. Frontend is located in [this](https://github.com/kr4chinin/xengine-frontend) repository. I've used PERN 
(PostgreSQL + Express + ReactJS + NodeJS) stack with some additional technologies (Sequelize, bcrypt, JWT Authorization etc.)
which will be mentioned later in this document.

## Introduction

First of all, I want to present PostreSQL DB relationships schema, it will help to fully undestand what's going on in this app. As you can see, I have 8 
tables and a bunch of connections between them. I am using [Sequelize](https://sequelize.org) as an **ORM** (Object-Relational Mapping) technology:

![Database Schema](https://user-images.githubusercontent.com/103210607/190917575-f31103ac-07d4-47d2-befe-93b2c42c040d.png)

For example, this is how **Vehicles** table looks like in **Postico** (MAC PostgreSQL client):

<img width="800" alt="Postico Vehicle table" src="https://user-images.githubusercontent.com/103210607/190917669-9d6d6593-fecb-40ca-9d68-3d6c7a07d9cb.png">

### Roles and authentication

I've implemented two *middlewares* - the first to check user role and the second to verify jwt token (using ```jwt.verify()``` from **jsonwebtoken** package).
When user has signed up he has ```USER``` role by default. It is stored as a ```role``` attribute in a **Users** table as long as user password
(whic is hashed with salt by **bcrypt**) and email. ```ADMIN``` role can be set only programmatically.

<img width="1063" alt="Users table" src="https://user-images.githubusercontent.com/103210607/190917968-dfb04817-439d-46d5-8b03-955f6a11d3c6.png">

### Static files

Admin can attach **file** as a vehicle image when he creating a new vehicle in his panel:

<img width="1421" alt="image" src="https://user-images.githubusercontent.com/103210607/190918247-575d8f74-0987-4e7c-a852-0308522660e2.png">

In ```vehicleController.js``` server is getting this image from ```req.files```, generating a **random** name for it (using **uuid** package) 
and putting it in the */static/images* folder. Then we are storing only img name in the DB, not the exact file. It can be then accessed by its name on client:

```
/* index.js */

app.use(fileUpload({}))
app.use(express.static(path.resolve(__dirname, '..', 'static', 'images')))

/* vehicleController.js */

// Getting image from request using express-fileupload
const { img } = req.files

// Generating random name for image
const fileName = uuid.v4() + '.jpg'

// Saving image to static folder (move to -> ../static/images)
img.mv(path.resolve(__dirname, '..', 'static', 'images', fileName))

//...
```
<img width="1195" alt="Image name in Vehicles table" src="https://user-images.githubusercontent.com/103210607/190918559-0e70e08d-6ed8-41ec-9983-338e98ed11c6.png">

As was mentioned in [frontend](https://github.com/kr4chinin/xengine-frontend) repository, in controllers I've implemented logic for client to:

* Handle authorization, password encryption and session.
* Get vehicles info, images and attributes. Sort them by various options in various orders.
* Roles and ability to check role.
* Ability to add and delete vehicles from cart, get specific user's cart.
* Ability to set and change rating for a vehicle.
* Ability for ```ADMIN``` to create and delete types, brands and vehicles.
* Validate user input data (via **express-validator**).

### Tech stack

* PostreSQL ([Postico](https://eggerapps.at/postico/) as a client, Sequelize as an ORM technology)
* NodeJS
* Express (+ express-validator, express-fileupload)
* jsonwebtoken
* bcrypt, uuid

