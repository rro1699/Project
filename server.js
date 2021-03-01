const express = require('express');
const bodyParesr = require('body-parser');
const app = express();

app.set('view engine','ejs');
app.use(bodyParesr.urlencoded({extended: true}));

const arr = [];
app.get('/', (req,res) => res.render('HomePage',{b:arr.length}));
app.post('/',(req,res) => {
	arr.push("id:"+req.body.id +" Interface:"+ req.body.inter +" message:"+req.body.message);
	res.redirect('/');
});
app.get('/list',(req,res) => res.render('ViewList',{arr:arr}));
app.listen(8080);
console.log('Сервер стартовал!');