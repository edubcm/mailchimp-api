const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const fs = require('fs');
const app = express();

app.use(express.json());
app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: true }));

let apiKey;
let listId;
try{
    let data = fs.readFileSync(__dirname + '/apiKey.txt', 'utf8');
    apiKey = data;
} catch(e) {
    console.log(e.stack);
}

try{
    let data = fs.readFileSync(__dirname + '/listId.txt', 'utf8');
    listId = data;
} catch(e) {
    console.log(e.stack);
}


function validateForm(req, res, next){
    const formSent = req.body;
    const email = formSent.email;
    const firstName = formSent.Fname;
    const Sname = formSent.Sname;

    if(email != '' && firstName != '' && Sname != ''){
        if(email.includes('@') && email.includes('.com') || email.includes('.br')){
            next();
        } else{
            res.sendFile(__dirname + '/html/errorEmail.html');
        }
    } else{
        res.sendFile(__dirname + '/html/errorValidate.html');
    }

}

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/html/index.html');
})

app.get('/index.html', (req, res) => {
    res.sendFile(__dirname + '/html/index.html');
})

app.post('/', validateForm, (req, res) => {
    const formSent = req.body;
    const email = formSent.email;
    const firstName = formSent.Fname;
    const Lname = formSent.Lname;

    let data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: Lname
            }
        }]
    };

    let jsonData = JSON.stringify(data);
    let url = `https://us21.api.mailchimp.com/3.0/lists/${listId}/`;

    const options = {
        method: 'POST',
        auth: `edubcm:${apiKey}`
    }
    const request = https.request(url, options, (response) => {
        if(response.statusCode === 200){
            res.sendFile(__dirname + '/html/success.html')
        } else {
            res.sendFile(__dirname + '/html/failure.html')
        }
        response.on("data", function(data){
            console.log(JSON.parse(data))
        })
    });
    request.write(jsonData);
    request.end();
})




module.exports = app;