const Patient = require('../models/patient');
const Doctor = require('../models/doctor');
const express = require('express')
const Record = require('../models/record');
const router = new express.Router()
const bcrypt=require('bcryptjs')


// /patients/signup
router.post('/patients/signup', (req, res) => {
    const {email, password} = req.body;
    if ( !email || !password ) {
        res.status(200).json({ msg: 'Please enter all fields' });
      }
    Patient.findOne({ email: email }).then(patient => {
        
        if (patient) {
            return res.status(403).json({ message: "Email is already registered with us." });
          
        } else {
          const newUser = new Patient(req.body);
  
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser
                .save()
                .then(user => {
                  res.send(user)
                  
                })
                .catch(err => console.log(err));
            });
          });
        }
      });
    }
  );
  // patients/signin 
  router.post('/patients/signin',(req,res,next)=>{
    const {email, password, field} = req.body;
    if ( !email || !password ) {
      res.status(200).json({ msg: 'Please enter all fields' });
    }
    Patient.findOne({email:email}).then(patient=>{
          if(!patient){
               res.send({message:"No such user exists"});
            }
           if(patient){
             
            bcrypt.compare(password, patient.password, (err, isMatch) => {
              if (err) throw err;
              else if (isMatch) {
                return res.send(patient);
              } else {
                return res.send({ message: 'Password incorrect' });
              }
            });
          }
     })
  })
  // Get a patient's prescription record
  router.get('/patients/:id/record',(req,res,next)=>{
    id = req.params.id
    console.log(id);
    Record.findOne({user:id}).then(register =>{
        if(register)
        res.send(register.case)
        else{
          res.send({mssg:"No prescription exists."})
        }
    }).catch(next)  
  }
  )
  // Add a new prescription to patient(Adds only one prescription at a time) 
  router.post('/patients/:id/record',(req,res,next)=>{
    const id = req.params.id;
   
    Record.findOne({user:id}).then(register =>{
      
      var prescription={symptoms:req.body.case[0].symptoms,medicine :req.body.case[0].medicine, dose: req.body.case[0].dose, date:req.body.case[0].date};
      if(register){
        register.case.push(prescription);
        register.save();
        res.send(register)
      }
      if(!register){
        const newUser = new Record({
          user:id,
          case: prescription
            
                  
        });
        newUser
            .save()
            .then(user => {
              
              res.send(user)
            })
            .catch(err => console.log(err)); 
      }
  
    })
    
  })
  // Find a patient by email
  router.post('/patients/find',(req,res,next)=>{
    const {email}=req.body;
    Patient.findOne({email:email}).then(patient=>{
       res.send(patient);
    })
  })
  // delete a patient from the db
  router.delete('/patients/:id', function(req, res, next){
    Patient.findByIdAndRemove({_id: req.params.id}).then(function(patient){
        res.send(patient);
    }).catch(next);
  });
  
  ////////////////////////////////////////  DOCTOR    //////////////////////////////////////////
  
  
  
  // doctors/signup
  router.post('/doctors/signup', (req, res) => {
      const {email, password, field} = req.body;
      if ( !email || !password ) {
          res.status(200).json({ msg: 'Please enter all fields' });
        }
      Doctor.findOne({ email: email }).then(doctor => {
          
          if (doctor) {
              return res.status(403).json({ message: "Email is already registered with us." });
            
          } else {
            const newUser = new Doctor(req.body);
    
            bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
                newUser.password = hash;
                newUser
                  .save()
                  .then(user => {
                    res.send(user)
                    
                  })
                  .catch(err => console.log(err));
              });
            });
          }
        });
      }
    );
   // doctors/login 
  router.post('/doctors/signin',async(req,res,next)=>{
      const {email, password, field} = req.body;
      Doctor.findOne({email:email}).then(doctor=>{
            if(!doctor){
                 res.send({message:"No such user exists"});
              }
             if(doctor){
               
              bcrypt.compare(password, doctor.password, (err, isMatch) => {
                if (err) throw err;
                else if (isMatch) {
                  return res.send(doctor);
                } else {
                  return res.send({ message: 'Password incorrect' });
                }
              });
            }
       })
  })
  //Find all doctors of same field
  router.post('/doctors/field',async (req, res, next) => {
    const field=req.body.field
    const regs = await Doctor.find({"field":field});
    return res.status(200).json({ data: regs })
  })
  // delete a doctor from the db
  router.delete('/doctors/:id', function(req, res, next){
      Doctor.findByIdAndRemove({_id: req.params.id}).then(function(doctor){
          res.send(doctor);
      }).catch(next);
  });
  
  module.exports = router;