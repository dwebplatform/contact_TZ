const express = require('express');

const app = express();
const jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');

var cors = require('cors');
const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(urlencodedParser);
const Sequelize = require("sequelize");
const sequelize = new Sequelize("data_base", "root", "", {
    dialect: "mysql",
    host: "localhost"
});





const Contact = sequelize.define('contact', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,

    },
    name: {
        type: Sequelize.STRING,
        defaultValue: "Sam"
    },
    phone_number:{
        type: Sequelize.STRING,

    },
    
});





app.post('/login', (req, res) => {

    if (req.body.password == "12345" && req.body.email == "test@mail.ru") {
        const user = {
            id: 1,
            password: "12345",
            email: "test@mail.ru",

        }
        jwt.sign({ user: user }, 'secretkey', (err, token) => {
            return res.json({
                error: false,
                token: token
            });
        });
    }
    else {
        return res.json({
            error: true,
            message: " Wrong data provided"
        })
    }

});


app.post('/add',verifyToken, async (req, res) => {

    const added_contact = await Contact.create({
        name: req.body.name,
        phone_number:req.body.phone_number
    });
    if(added_contact instanceof Contact){
        return res.json({
            error: false,
            message:"Created successfully",
            data:added_contact
        });
    }
    return res.json({
        error: true,
        message:" Не удалось создать новую запись"
    })

});

app.post('/update', async (req, res) => {


    let updated_contact = await Contact.findOne({
        where: {
            id: req.body.id
        }
    });
    if (updated_contact instanceof Contact) {
        updated_contact.name = req.body.name;

        updated_contact.phone_number = req.body.phone_number;

        updated_contact.save();
        return res.json({
            error: false,
            body: req.body
        })
    }
    return res.json({
        error: true,
        message: "Не удалось обновить запись"
    });
});

app.get('/all', verifyToken, async (req, res) => {
    jwt.verify(req.token, 'secretkey', async (err, authData) => {
        if (err) {
            return res.json(err);
        }
        else {
            let all_contacts = await Contact.findAll({ raw: true });
            if (all_contacts.length > 0)
                return res.json({
                    error: false,
                    body: all_contacts
                });
            return res.json({
                error: true,
                message: "Не найдено записей"
            });
        }
    });

});





sequelize.sync().then(result => {
    console.log(result);
})
    .catch(err => console.log(err));


app.post('/delete_contact/:deleted_id', verifyToken, async (req, res) => {
    let deleted_contact = await Contact.findByPk(parseInt(req.params.deleted_id));
    await deleted_contact.destroy();
    return res.json({
        error: false,
        body: deleted_contact
    })
});

function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];

    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        // Get token from array
        const bearToken = bearer[1];
        req.token = bearToken;
        // Next middleware

        next();
    }
    else {
        // Forbidden
        return res.json({
            error: true,
            message: 'You are not authorised'
        });

    }

}
app.listen(8000, () => console.log('listening port 5000'))