const express = require("express");
const app = express();
const Joi = require("joi");

const port = 3000;

app.use(express.json());

const items = [
  {
    id: 1,
    patient_name: "Alex",
    address: "123 Boulevard NYC,NY 12345",
    hospital: "Mount Sinai",
    date: "October 25, 2021",
    bill_amount: 1000,
  },
  {
    id: 2,
    patient_name: "Sandy",
    address: "234 Trail NYC,NY 12345",
    hospital: "Coney Island",
    date: "January 4, 2019",
    bill_amount: 500,
  },
];

app.get("/items", (req, res) => {
  res.json(items);
});

app.get("/items/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const item = items.find((p) => p.id === id);
  if (!item) {
    return res.status(404).send("Medical bill not found");
  }
  res.json(item);
});

app.post("/items", (req, res) => {
  const { patient_name, address, hospital, date, bill_amount } = req.body;

  const itemSchema = Joi.object({
    patient_name: Joi.string().required(),
    address: Joi.string().required(),
    hospital: Joi.string().required(),
    date: Joi.string().required(),
    bill_amount: Joi.number().integer().min(0).required(),
  });

  const { error, value } = itemSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const newItems = {
    id: items.length + 1,
    patient_name,
    address,
    hospital,
    date,
    bill_amount,
  };

  items.push(newItems);

  res.json(items);
});

const server = app.listen(port, () => console.log(`On port ${port}...`));

module.exports = server;
