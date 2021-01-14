const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const fs = require('fs');
const { traceDeprecation } = require('process');
const app = express();

let domain = 'http://localhost:8080';

let port = 8080;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser());

app.get('/', (req, res) => {
    res.render('home.ejs')
})

app.get('/url/:url', (req, res) => {
    let getUrls = fs.readFileSync('urls.json', 'utf-8');
    getUrls = JSON.parse(getUrls);
    for (let i = 0; i < getUrls.length; i++) {
        let reqId = req.params.url;
        reqId = parseInt(reqId);
        if (getUrls[i].id == reqId) {
            res.redirect(getUrls[i].destination)
            break;
        }
    }
})

app.get('/shortened/:linkId', (req, res) => {
    res.render('shortened.ejs', {
        shortenedLink: `${domain}/url/${req.params.linkId}`
    })
})

app.post('/shorten', (req, res) => {
    let url = req.body.urlToShorten;
    let linkId = Math.floor(Math.random() * 1000000)

    let getUrls = fs.readFileSync('urls.json', 'utf-8');
    getUrls = JSON.parse(getUrls);

    let urlData = encodeURIComponent({linkId: linkId})
    getUrls.push({id: linkId, destination: url})
    fs.writeFileSync('urls.json', JSON.stringify(getUrls))
    res.redirect(`/shortened/${linkId}`)

})

app.listen(port, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log(`Listening to port: ${port}`);
    }
})