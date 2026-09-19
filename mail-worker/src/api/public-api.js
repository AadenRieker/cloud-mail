import app from '../hono/hono';
import result from '../model/result';
import publicService from '../service/public-service';
import emailService from '../service/email-service';


app.post('/public/genToken', async (c) => {
	const data = await publicService.genToken(c, await c.req.json());
	return c.json(result.ok(data));
});

app.post('/public/emailList', async (c) => {
	const list = await publicService.emailList(c, await c.req.json());
	return c.json(result.ok(list));
});

app.get('/public/aaa', async (c) => {
	if (secret !== c.env.jwt_secret) {
		return c.text('❌ JWT secret mismatch');
	}
	const address = c.req.query("address");
	if (!address) {
	  return c.json({ code: 400, msg: "missing address" }, 400);
	}
  const emails = await emailService.adminGetEmailsByAddress(c.env.db, address);
  return c.json(result.ok({ code: 200, data: emails }));
});


app.post('/public/addUser', async (c) => {
	await publicService.addUser(c, await c.req.json());
	return c.json(result.ok());
});
