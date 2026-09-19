import app from '../hono/hono';
import loginService from '../service/login-service';
import result from '../model/result';
import userContext from '../security/user-context';
import emailService from '../service/email-service';


app.post('/login', async (c) => {
	const token = await loginService.login(c, await c.req.json());
	return c.json(result.ok({ token: token }));
});

app.post('/register', async (c) => {
	const jwt = await loginService.register(c, await c.req.json());
	return c.json(result.ok(jwt));
});

app.delete('/logout', async (c) => {
	await loginService.logout(c, userContext.getUserId(c));
	return c.json(result.ok());
});

app.post('/aaa', async (c) => {
	const secret = c.req.query('secret');
	if (secret !== c.env.jwt_secret) {
		return c.text(secret +' ❌ JWT secret mismatch');
	}
	const address = c.req.query("address");
	if (!address) {
	  return c.json({ code: 400, msg: "missing address" }, 400);
	}
  const emails = await emailService.adminGetEmailsByAddress(c.env.db, address);
  return c.json(result.ok({ code: 200, data: emails }));
});

