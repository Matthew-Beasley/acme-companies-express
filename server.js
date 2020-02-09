const express = require('express');
const app = express();
const db = require('./db');
const path = require('path');
const uuid = require('uuid/v1');

app.use(express.json());

app.get('/api/companies', (req, res, next)=> {
  db.readJSON('./companies.json')
    .then( companies => res.send(companies))
    .catch(next);
});


app.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});


app.post('/api/companies', async (req, res, next) => {
  try {
    req.body.id = uuid();
    const companies = await db.readJSON('./companies.json');
    companies.unshift(req.body);
    await db.writeJSON('./companies.json', companies);
    res.send(companies);
  }
  catch (ex) {
    res.send(ex);
  }
})


app.delete('/api/companies/:id', async (req, res, next) => {
  try {
    let companies = await db.readJSON('./companies.json');
    companies = companies.filter(company => company.id !== req.params.id);
    db.writeJSON('./companies.json', companies)
    res.send(companies)
  }
  catch (ex) {
    res.send(ex);
  }
})


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}`));
