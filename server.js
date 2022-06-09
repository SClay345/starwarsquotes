const express = require('express')
const bodyParser = require('body-parser')
const app = express()
import key from st.js

const MongoClient = require('mongodb').MongoClient

const PORT = 2121

MongoClient.connect(key,{ useUnifiedTopology: true })
    .then(client =>{
        console.log('Connected to Database')
        const db = client.db('star-wars-quotes')
        const quotesColletion = db.collection('quotes')

        app.set('view engine', 'ejs')
        app.use(bodyParser.urlencoded({extended:true}))
        app.use(bodyParser.json())
        app.use(express.static('public'))



        // Create
        app.post('/quotes', (req,res)=>{
            quotesColletion.insertOne(req.body)
                .then(result => {
                    res.redirect('/')
                 })
                 .catch(error=>console.error(error))
            })


        // Read
        app.get('/', (req,res)=> {
            db.collection('quotes').find().toArray()
                .then(results => {
                    res.render('index.ejs', {quotes: results})

                })
                .catch(error => console.error(error))
           // res.sendFile(__dirname + '/index.html')
        })


        //Put(Update)
        app.put('/quotes', (req,res)=> {
            quotesColletion.findOneAndUpdate(
                {name: 'Yoda'},
                {
                    $set: {
                        name: req.body.name,
                        quote: req.body.quote
                    }
                },
                {
                    upsert: true
                }
            )
            .then(result => {
                res.json('Success')
            })
            .catch(error => console.error(error))
        })

        // Delete
        app.delete('/quotes', (req,res)=> {
            quotesColletion.deleteOne(
                {name: req.body.name}
            )
            .then(result => {
                if(result.deletedCount === 0){
                    return res.json('No Quote to delete')
                }
                res.json(`Deleted Darth Vader's quote`)
            })
            .catch(error => console.error(error))
        })


        // Server On
        app.listen(PORT,function(){
            console.log('Server is Running!')
        })
    })
    .catch(error => console.error(error))
    


  