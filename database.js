module.exports = {
	
	numUsers: async function(conn){
		//const conn = await mysql.createConnection(config);
		let a = `SELECT id FROM mybd.users`;
		const [rows,fields] = await conn.execute(a);
		console.log(rows[rows.length-1]['id']);
		return rows[rows.length-1]['id'];
	},
	
	getInterfaces: async function(conn, id){
		let c = `SELECT * FROM mybd.users WHERE id=${id}`;
		let arr = [];
		const [rows1,fields1] =  await conn.execute(c);
		console.log(rows1);
		if(rows1[0].LTE == 1){
			arr.push("LTE");
		}
		if(rows1[0].LoRa==1){
			arr.push("LoRa");
		}
		if(rows1[0].WiFi==1)
		{
			arr.push("WiFi");
		}
		return arr;
	},
	
	Log: async function(conn, time, id, nameInt, CurMes){
		let d = `Insert into mybd.Log(Moment, IdUser, Interface, Message) values ('${time}', ${id}, '${nameInt}', '${CurMes}')`;
		await conn.execute(d);
	}
};