const express = require('express')
const bodyParser = require('body-parser')
const { body, validationResult } = require('express-validator')

const PORT = 8080
const app = express()
app.set('view engine', 'ejs')

const guests = [
]

app.use(bodyParser.urlencoded())

app.use((req, _, next) => {
    console.log('new request on', req.method, req.url);
    next()
})

app.use(express.static('public'))

app.get('/', (_, res) => {
    res.render("home", { guests })
})

app.post(
    '/newguest',
    body('fname').isLength({ min: 1, max: 40 }),
    body('name').isLength({ min: 1, max: 40 }),
    body('email').isEmail(),
    body('posts').isLength({ min: 3, max: 500 }),
    (req, res) => {
        const neuerGast = req.body

        const errors = validationResult(req)
        const isValidUser = errors.isEmpty()

        if (!isValidUser) {
            const validationErrors = errors.array()
            res.render("invalinputErr", {
                description: "user input is invalid, please try again", validationErrors
            })
            return
        }

        guests.push(neuerGast)
        console.log(guests);
        res.redirect('/')
    }
)

app.use((req, res) => {
    console.log(req.method, req.url, "route was not found...");
    res.end()
})

app.listen(PORT, () => console.log('Server listening on Port', PORT))