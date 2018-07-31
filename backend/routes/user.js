const express = require('express');
const bcrypt = require('bcrypt');

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

module.exports = router;
