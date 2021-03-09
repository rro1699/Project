const express = require('express');
const bodyParesr = require('body-parser');
const mysql = require('mysql2/promise');
const config = require('./config'); 


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
	let a = `SELECT id FROM test.Users`;
	const [rows,fields] = await conn.execute(a);
	
	
	let arr = [];
	let arr1 = [];
	let arr2 = [];
	let c;
	let tmp;
	app.get('/', (req,res) => res.render('HomePage',{b:rows[rows.length-1]['id']}));
	app.post('/',(req,res) => {
		tmp  = req.body.id;
		c = `SELECT Interfaces FROM test.Users WHERE id=${tmp}`;
		permen();
		res.redirect('/send');
	});	
	
	async function permen(){
		const [rows1,fields1] =  await conn.execute(c);
		console.log(rows1);
		let tmp1 = rows1[0].Interfaces;
		console.log(tmp1);
		while(tmp1>=1){
			arr1.push(tmp1%10);
			tmp1 = Math.floor(tmp1/10);
		}
		for(let i=0;i<arr1.length;i++){
			let d = `SELECT NameInterface FROM test.interfaces WHERE id=${arr1[i]}`;
			const [rows2,fields2] =  await conn.execute(d);
			arr2.push(rows2[0].NameInterface);
		}
	}
	
	async function writeLog(nameInt, CurMes){
		let d = `Insert into test.Log(Moment, IdUser, Interface, Message) values ('${getDateTime()}', ${tmp}, '${nameInt}', '${CurMes}')`;
		await conn.execute(d); 
	}
	app.get('/send', (req,res) =>{
		res.render('HomePage1',{arr:arr2});
	});
	app.post('/send',(req,res) => {
		arr.push("id:"+tmp +" Interface:"+ req.body.inter +" message:"+req.body.message);
		writeLog(req.body.inter, req.body.message);
		arr1 = [];	
		arr2 = [];
		res.redirect('/');
	});
	app.get('/list',(req,res) => res.render('ViewList',{arr:arr}));	
	app.listen(8080);
	console.log('Сервер стартовал!');
}

main();