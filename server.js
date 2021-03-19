const express = require('express');
const bodyParesr = require('body-parser');
const mysql = require('mysql2/promise');
const config = require('./config'); 
const bd = require('./database'); 

const app = express();
app.set('view engine','ejs');
app.use(bodyParesr.urlencoded({extended: true}));

function getDateTime() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec;

}


async function main(){
	const conn = await mysql.createConnection(config);
	
	let arr = [];
	let arr2 = [];
	let tmp;
	let numU = await bd.numUsers(conn);
	//console.log(numU);
	app.get('/', (req,res) => res.render('HomePage',{b:numU}));
	app.post('/',(req,res) => {
		tmp  = req.body.id;
		 per();
		res.redirect('/send');
	});	
	
	async function per()
	{
		arr2 =  await bd.getInterfaces(conn,tmp);
		console.log(arr2);
	}
	
	
	async function writeLog(nameInt,CurMes){
		bd.Log(conn,getDateTime(),tmp,nameInt,CurMes);
	}
	
	app.get('/send', (req,res) =>{
		res.render('HomePage1',{arr:arr2});
	});
	app.post('/send',(req,res) => {
		arr.push("id:"+tmp +" Interface:"+ req.body.inter +" message:"+req.body.message);
		
		writeLog(req.body.inter, req.body.message);
		arr2 = [];
		res.redirect('/');
	});
	app.get('/list',(req,res) => res.render('ViewList',{arr:arr}));	
	app.listen(8080);
	console.log('Сервер стартовал!');
}

main();