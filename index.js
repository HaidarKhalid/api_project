let express = require("express")
const Datastore = require("nedb")
require('dotenv').config();
 
console.log(process.env)
let app = express()
app.listen(8000, ()=> {
    console.log('listening')
})
app.use(express.static('public')) 
app.use(express.json({ limit: '4mb'} ))
const db = new Datastore('mydb.db')
db.loadDatabase()
app.post('/api', (request, response)=> {
    const data = request.body
    data.getTime = Date.now()
    db.insert(data)
    console.log(db)
    response.json({
        status: 'ok',
        lon: data.lon,
        getTime: Date.now(),
        lat: data.lat
    })
    console.log(data)
})

app.get('/api', (request, response)=> {
    db.find({}, (err, data)=> {
        if (err) {response.end();return;}
        response.json(data)
    })
})
app.get('/weather/:latlon', async (request, response)=> {
    let latlon = request.params['latlon'].split(",")
    let lat = latlon[0] 
    let lon = latlon[1] 
    let api_key = process.env.API_KEY
    let apiURL = `http://api.weatherapi.com/v1/current.json?key=${api_key}&q=${lat},${lon}&aqi=yes`
    const fRes = await fetch(apiURL);
    const json = await fRes.json()
    response.json(json)
})