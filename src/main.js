const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const app = express();

app.use(express.json());
app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: true }));

function validateForm(req, res, next){
    const formSent = req.body;
    const email = formSent.email;
    const firstName = formSent.Fname;
    const Sname = formSent.Sname;

    if(email != '' && firstName != '' && Sname != ''){
        if(email.includes('@') && email.includes('.com') || email.includes('.br')){
            next();
        } else{
            res.send({'ERROR': 'Please check your email again.'})
        }
    } else{
        res.send({'ERROR': 'Please fill in all required fields.'})
    }

}

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/html/index.html');
})

app.post('/', validateForm, (req, res) => {
    const formSent = req.body;
    const email = formSent.email;
    const firstName = formSent.Fname;
    const Sname = formSent.Sname;


})




module.exports = app;