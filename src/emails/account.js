const sgMail = require('@sendgrid/mail')
//const sendgridAPIKey = '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'

sgMail.setApiKey(process.env.SENDGRID_API_KEY)
// sgMail.send({
//     to:'neerajgoyaln@gmail.com',
//     from:'1801me37@iitp.ac.in',
//     subject:'This is my first creation',
//     text: 'I hope this one actually get to you'
// })

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from:'neerajgoyaln@gmail.com',
        subject: 'Thanks for joining in!',
        text: 'Welcome to the app,'+ name +'. Let me know how you get along with the app'
    })
}

const sendGoodByeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from:'neerajgoyaln@gmail.com',
        subject: 'Sorry to see you go!',
        text: 'GoodBye,'+ name +'. I hope to see you back sometime soon.'
    })
}

module.exports = {
    sendWelcomeEmail,
    sendGoodByeEmail
}