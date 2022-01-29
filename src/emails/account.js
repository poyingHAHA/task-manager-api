const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({ // thid is a asymcronus function which return a Promise
        to: email,
        from:'poying.code@gmail.com',
        subject: 'Thanks for joining in!',
        text: `Welcome to the app, ${name}. Let me know how you get along with the app.`
    })
}

const sendCancelEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'poying.code@gmail.com',
        subject: 'Sorry to see you go!',
        text: `Goodbye ${name}. I hope to see you back sometime`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelEmail
}

// sgMail.send({
//     to: 'poying.code@gmail.com',
//     from: 'poying.code@gmail.com',
//     subject: 'This is my first creation!',
//     text: 'I am you la!'
// })