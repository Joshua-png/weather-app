const express = require('express');
const path = require('path');
const hbs = require('hbs');
const request = require('request');

const app = express();

const port = 4000;

const viewsPath = path.join(__dirname, '/template/views');
const partialsPath = path.join(__dirname, '/template/partials');

app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath)

app.use(express.static('public'));
app.use('/css', express.static('public/css') );
app.use('/js', express.static('public/js'));
app.use('/images', express.static('public/images'));

app.get('/', (req, res) => {
    // res.sendFile('index.html');
    res.render('index', {
        title: 'Home Page',
        author: 'Joshua Aryee'
    })
})

app.get('/help', (req, res) => {
    // res.sendFile(__dirname + '/public/help.html');
    res.render('help', {
        title: 'Help Page',
        message: 'This page is meant to help you',
        author: 'Joshua Aryee'
    })
})

app.get('/about', (req, res) => {
    // res.sendFile(__dirname + '/public/about.html');
    res.render('about', {
        title: 'About Page',
        author: 'Joshua Aryee'
    })
})

const getCoordinates = (address,callback) => {
    const url2 = `https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=pk.eyJ1IjoicHJvZmpvc2h1YSIsImEiOiJjbDA2bzN0OGkxN3B0M3BwMzJ2dmQxOW9yIn0.ra_xgcFkVhwl4bVFNkn6DQ`
    request({url: url2, json: true}, function(error, response){
        if(error){
            console.log('Unable to connect to API')
            callback('Unable to connect to API', undefined)
        }else if(response.body.features.length === 0 ){
            callback('Unable to find a location, Try another search', undefined)
        }else{
            const {center} = response.body.features[0];
            console.log(`Longitude is ${center[0]}, Latitude is ${center[1]}`);
            callback(undefined, center)
        } 
     })
}

const getWeather = (coordinates,callback) => {
    const url = `http://api.weatherstack.com/current?access_key=b95d4aeae5fdecf22216cd4f4bee9d1c&query=${coordinates[1]},${coordinates[0]}&units=f`
   
        request({url: url, json: true}, function(error, response) {
            if(error){
                callback('Can not connect to weather API', undefined)
            }else if(response.body.error){
                callback('There is an error with your input', undefined)
            }else{
                const {temperature, feelslike } = response.body.current;
                const {name, country, region} = response.body.location;
                callback(undefined, {temperature, feelslike, name, country, region});
            }
        })
}


app.get('/weather', (req, res) => {
    const {address} = req.query
    if(!address){
        return res.send({
            error: 'A weather query must be added'
        })
    }

    getCoordinates(address, (error,data) => {
        if(error){
            return res.send({
                error: 'There was an error'
            })
        }

        getWeather(data, (error, {temperature, feelslike, name, country, region}) => {
            if(error){
                return res.send({
                    error: 'There was an error'
                })
            }
            // const {temperature, feelslike, name, country, region} = data;

            res.json({
                forecast: `It feels like ${temperature} Fahrenheit but it feels like ${feelslike} Fahrenheit`,
                location: country,
                address: name
            })
        })
    })

})

app.get('/help/*', (req, res) => {
  res.render('404', {
      author: 'Joshua Aryee',
      errorMessage: 'Help Article not found'
  })  
})

app.get('*', (req, res) => {
    res.render('404', {
        author: 'Joshua Aryee',
        errorMessage: '404 Page not Found'
    });
})

app.listen(port, () => {
    console.log(`Listening to port ${port}`)
})