// index.js
let express = require('express');
let mongoose = require('mongoose');
const bodyParser = require('body-parser');
let app = express();

// DB
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(process.env.MONGO_DB);
let db = mongoose.connection;

db.once('open', () => {
  console.log('DB connected');
});

db.on('error', (err) => {
  console.log('DB ERROR : ', err);
});

// Other settings

app.set('view engine', 'ejs');
app.use(express.static(__dirname+'/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

let contactSchema = mongoose.Schema({
  name:{type:String, required:true, unique:true},
  email:{type:String},
  phone:{type:String}
});

let Contact = mongoose.model('contact', contactSchema);

// Routes
// Home // 6
app.get('/', (req, res) => {
  res.redirect('/contacts');
});

// Contacts - Index // 7
app.get('/contacts', (req, res) => {
  Contact.find({}, (err, contacts) => {
    if(err) return res.json(err);
    res.render('contacts/index', {contacts:contacts});
  });
});

// Contacts - New // 8
app.get('/contacts/new', (req, res) => {
  res.render('contacts/new');
});

// Contacts - create // 9
app.post('/contacts', (req, res) => {
  Contact.create(req.body, (err, contact) => {
    if(err) return res.json(err);
    res.redirect('/contacts');
  })
})

let port = 3000;
app.listen(port, ()=> {
  console.log('server on! http://localhost:'+port);
});