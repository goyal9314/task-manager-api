const express = require('express')
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const crypto = require('crypto')

const User = require('../models/user')
const sharp = require('sharp')
const auth = require('../middleware/auth')
const multer = require('multer')
const Password = require('../models/Password')
const fileUpload = require('express-fileupload')
const { sendWelcomeEmail,sendGoodByeEmail } = require('../emails/account')

const upload = multer({
    //dest: 'avatar', //we are saving in user profile 
    limits: {
        fileSize: 1000000 //1 MB
    },
    fileFilter(req, file, cb) {
        // if(!file.originalname.endsWith('.pdf')){
        //     return cb(new Error('Please upload a PDF'))
        // }
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload a an Image'))
        }
        // cb(new Error('File must be a PDF'))
         cb(undefined, true)
        // cb(undefined, false)
    }

})
const uploadpdf = multer({
    dest: 'image' //we are saving in user profile 
    
   /* fileFilter(req, file, cb) {
        // if(!file.originalname.endsWith('.pdf')){
        //     return cb(new Error('Please upload a PDF'))
        // }
        if(!file.originalname.match(/\.(pdf)$/)) {
            return cb(new Error('Please upload a an pdf'))
        }
        // cb(new Error('File must be a PDF'))
         cb(undefined, true)
        // cb(undefined, false)
    }*/

})
const router = new express.Router()

router.use(fileUpload());

router.post('/users',async (req,res) => {
    // console.log(req.body)
    // res.send('testing!')

    const user = new User(req.body)
    //async await
    try {
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    } catch(e) {
        res.status(400).send(e)
    }
    // user.save().then(() => {
    //     res.send(user)
    // }).catch((error) => { 
    //     res.status(400).send(error)
    // })

})

router.post('/users/login',async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
        
    }catch(e) {
        res.status(400).send()

    }
})

router.post('/users/logout',auth, async(req,res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/users/logoutAll',auth, async(req,res) => {
    try {
        req.user.tokens = []
        // req.user.tokens.filter((token) => {
        //     return token.token !== req.token
        // })
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/users/me', auth ,async (req, res) => {
    
    res.send(req.user)
    // User.find({name:'Neeraj'}).then((users) => {
    //     res.send(users)
    // }).catch((error) => {
    //     res.status(500).send(error)
    // })
})

// router.get('/users/:id',async (req, res) => {
//     const _id = req.params.id

//     try {
//         const user = await User.findById(_id)
//         if(!user) {
//             return res.status(404).send()
//         }
//         res.send(user)
//     } catch (e) {
  
//         res.status(500).send(e)
//     }
//     // User.findById(_id).then((user) => {
//     //     if(!user) {
//     //         return res.status(404).send()
//     //     }

//     //     res.send(user)
//     // }).catch((e) => {
//     //     res.status(500).send()
//     // })
// })

router.patch('/users/me',auth, async (req,res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name' ,'email', 'password', 'age']
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    })
    if(!isValidOperation) {
        return res.status(400).send({error: 'Invalid Updates!'})
    }
    try{
        //const user = await User.findById(req.params.id)

        updates.forEach((update) => {
            req.user[update] = req.body[update]
        })
        await req.user.save()
        //const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
        // if(!user) {
        //     return res.status(404).send()
        // }
        res.send(req.user)

    }catch(e) {
        res.status(400).send(e)
    }
})

router.delete('/users/me',auth, async(req, res) => {
    try{
        // const user = await User.findByIdAndDelete(req.user._id)
        // if(!user) {
        //     return res.status(404).send()
        // }
        
        await req.user.remove()
        sendGoodByeEmail(req.user.email, req.user.name)
        res.send(req.user)
    }catch(e) {
        res.status(500).send(e)
    }
})

router.post('/users/me/avatar', auth ,upload.single('avatar') , async (req,res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send(req.user)

}, (error,req, res, next) => {
    res.status(400).send({ error: error.message})
})

router.post('/users/pdf',auth,upload.single('pdf'),async (req, res) => {
    //const buffer = await sharp(req.file.buffer).toBuffer()
    req.user.avatar = req.file
    await req.user.save()
    res.send(req.user)
})

router.delete('/users/me/avatar', auth, async (req,res) => {
    try {
        req.user.avatar = undefined
        await req.user.save()
        res.send(req.user)
    } catch(e) {
        res.status(500).send(e)
    }
})

router.get('/users/me/avatar', auth,async (req, res)=> {
    try {
        //const user = await User.findById(req.params.id)

        // if (!user || !user.avatar) {
        //     throw new Error()
        // }
         res.set('Content-Type', 'image/png')
        res.send(req.user.avatar)
    } catch(e) {
        res.status(400).send()
    }
})

router.post('/recover', (req, res) => {
    User.findOne({email: req.body.email})
        .then(user => {
            if (!user) return res.status(401).json({message: 'The email address ' + req.body.email + ' is not associated with any account. Double-check your email address and try again.'});

            //Generate and set password reset token
            // user.generatePasswordReset()
            user.resetPasswordToken = crypto.randomBytes(20).toString('hex')
            user.resetPasswordExpires = Date.now() + 3600000

            // Save the updated user object
               user.save()
                .then(user => {
                    // send email
                    let link = "http://" + req.headers.host + "/api/auth/reset/" + user.resetPasswordToken;
                    const mailOptions = {
                        to: 'goyalneerajg@gmail.com',
                        from: 'neerajgoyaln@gmail.com',
                        subject: "Password change request",
                        text: `Hi ${user.name} \n 
                    Please click on the following link ${link} to reset your password. \n\n 
                    If you did not request this, please ignore this email and your password will remain unchanged.\n`,
                    };

                    /*sgMail.send(mailOptions, (error, result) => {
                        if (error) return res.status(500).json({message: error.message});

                        res.status(200).json({message: 'A reset email has been sent to ' + user.email + '.'+req.headers.host+'  '+user.resetPasswordToken});
                    })*/
                    sgMail.send({
                        to: user.email,
                        from:'neerajgoyaln@gmail.com',
                        subject: 'Thanks for joining in!',
                        text: 'Welcome to the app,'+ user.name +'. Let me know how you get along with the app'
                    })
                })
                .catch(err => res.status(500).json({message: err.message}))
        })
        .catch(err => res.status(500).json({message: err.message}))
}
   )

router.get('/reset/:token', Password.reset)

router.post('/reset/:token', (req, res) => {
    User.findOne({resetPasswordToken: req.params.token, resetPasswordExpires: {$gt: Date.now()}})
        .then((user) => {
            if (!user) return res.status(401).json({message: 'Password reset token is invalid or has expired.'});

            //Set the new password
            user.password = req.body.password;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            // Save
            user.save((err) => {
                if (err) return res.status(500).json({message: err.message});

                // send email
                const mailOptions = {
                    to: user.email,
                    from: 'neerajgoyaln@gmail.com',
                    subject: "Your password has been changed",
                    text: `Hi ${user.username} \n 
                    This is a confirmation that the password for your account ${user.email} has just been changed.\n`
                };

                sgMail.send(mailOptions, (error, result) => {
                    if (error) return res.status(500).json({message: error.message});

                    res.status(200).json({message: 'Your password has been updated.'});
                });
            });
        });
})

router.post("/upload",(req, res) => {
    const file = req.files.photo;
    file.mv("./uploads/", file.name, function(err, result) {
        if(err){
            throw  err;
        }else{
            res.send({message : 'success'});
        }

     });
   

})

module.exports = router