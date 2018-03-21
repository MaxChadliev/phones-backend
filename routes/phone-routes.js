const mongoose = require("mongoose");
const express = require("express");
const multer = require('multer');
const phoneRoutes = express.Router();

const Phone = require('../models/phone-model');

// multer for photo
const myUploader = multer({
  dest: __dirname + "/../public/uploads/"
});


// create new phone
phoneRoutes.post('/api/phones', myUploader.single('phoneImage'), (req, res, next) => {
    if(!req.user){
        res.status(401).json({message: "Log in to create phone."});
        return;
    }
    const newPhone = new Phone({
      brand: req.body.phoneBrand,
      name: req.body.phoneName,
      color: req.body.phoneColor,
      owner: req.user._id
    });
    
    if(req.file){
        newPhone.image = '/uploads/' + req.file.filename;
    }

    newPhone.save((err) => {
        if(err){
            res.status(500).json({message: "Error from DB."});
            return;
        }
        // validation errors
        if (err && newPhone.errors){
            res.status(400).json({
                brandError: newPhone.errors.brand,
            });
            return;
        }

        req.user.encryptedPassword = undefined;
        newPhone.user = req.user;

        res.status(200).json(newPhone);
    });
});

// list the phones

phoneRoutes.get('/api/phones', (req, res, next) => {
    if (!req.user) {
      res.status(401).json({ message: "Log in to see phones." });
      return;
    }
    Phone.find()
      // retrieve all the info of the owners (needs "ref" in model)
      // don't retrieve "encryptedPassword" though
      .populate('user', { encryptedPassword: 0 })
      .exec((err, allThePhones) => {
        if (err) {
          res.status(500).json({ message: "Phones find went bad." });
          return;
        }
        res.status(200).json(allThePhones);
      });
});

// list single phone
phoneRoutes.get("/api/phones/:id", (req, res, next) => {
  if (!req.user) {
    res.status(401).json({ message: "Log in to see THE phone." });
    return;
  }
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Phone.findById(req.params.id, (err, thePhone) => {
    if (err) {
      //res.json(err);
      res.status(500).json({ message: "Phones find went bad." });
      return;
    }

    res.status(200).json(thePhone);
  });
});

// update the phone
phoneRoutes.put('/api/phones/:id', (req, res, next) => {
    if (!req.user) {
      res.status(401).json({ message: "Log in to update the phone." });
      return;
    }
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400).json({ message: "Specified id is not valid" });
        return;
    }

    const updates = {
        brand: req.body.phoneBrand,
        name: req.body.phoneName,
        color: req.body.phoneColor,
        // image: req.body.image    
    };
    if(req.body.image){
      updates.image = req.body.image;
    }

  Phone.findByIdAndUpdate(req.params.id, updates, err => {
    if (err) {
      res.json(err);
      return;
    }

    res.json({
      message: "Phone updated successfully."
    });
  });
});

// delete phone
phoneRoutes.delete("/api/phones/:id", (req, res, next) => {
  if (!req.user) {
    res.status(401).json({ message: "Log in to delete the phone." });
    return;
  }
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: "Specified id is not valid." });
    return;
  }

  Phone.remove({ _id: req.params.id }, err => {
    if (err) {
      res.json(err);
      return;
    }

    res.json({
      message: "Phone has been removed."
    });
  });
});


module.exports = phoneRoutes;
