const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https")
const app = express();
const mailchimp = require("@mailchimp/mailchimp_marketing");
const { Console } = require("console");

mailchimp.setConfig({
    apiKey: "79fa8aede3c55afd9166bebbbcd39a06-us20",
    server: "us20",
});

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const email = req.body.email;
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us20.api.mailchimp.com/3.0/lists/566037b6d4";
    const options = {
        method: "POST",
        auth: "jiayuan:79fa8aede3c55afd9166bebbbcd39a06-us20"
    };
    const request = https.request(url, options, function(response){
        // response.on("data", function(data){
        //     console.log(JSON.parse(data));
        // });

        if(response.statusCode == "200"){

            res.sendFile(__dirname + "/success.html");
        }
        else{
            res.sendFile(__dirname + "/failure.html");
        }
    });

    request.write(jsonData);
    request.end();
});

app.post("/failure", function(req, res){
    res.redirect("/");
});

app.listen(process.env.PORT || 3000, function(){
    console.log("server is running on port 3000");
});

// api key
// 79fa8aede3c55afd9166bebbbcd39a06-us20

// list id
// 566037b6d4