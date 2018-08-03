const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user.model');

const router = express.Router();

router.post('/signup', (req, res, next) => {
  /*
  argument of bcrypt
  1. data want to encryption
  2. Salt Round actually mean the cost factor. 
  The cost factor controls how much time is needed to calculate 
  a single BCrypt hash. The higher the cost factor, 
  the more hashing rounds are done. 
  Increasing te cost factor by 1 doubles the necessary time. 
  The more time is necessary, the more difficult is brute-forcing.
  3. Promise/callback return result of encryption
  */
  bcrypt.hash(req.body.password, 10)
    .then(hashResult => {
      const user = new User({
        email: req.body.email,
        password: hashResult
      });

      user.save()
        .then(result => {
          res.status(201).json({
            message: 'User created!',
            result: result
          });
        }).catch(err => {
          res.status(500).json({
            error: err
          });
        });
    });
});

router.post('/login', (req, res, next) => {
  let fetchedUser;
  User.findOne({
      email: req.body.email
    })
    .then(user => {
      if (!user) {
        return res.status(404).json({
          message: 'Auth failed'
        });
      }
      fetchedUser = user;
      // Compare by bcrypt because in database store hash
      return bcrypt.compare(req.body.password, user.password)
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: 'Auth failed'
        });
      }
      //create token an send back to user
      const token = jwt.sign({
        email: fetchedUser.email,
        userId: fetchedUser._id
      }, 'secret_this_should_be_longer', {
        expiresIn: '1h', 
      });

      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id
      });

    }).catch(err => {
      return res.status(401).json({
        message: 'Auth failed'
      });
    });
});

module.exports = router;
