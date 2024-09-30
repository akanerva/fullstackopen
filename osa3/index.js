const express = require("express");
const app = express();
app.use(express.json());

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (req, res) => {
  res.status(200).json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const person = persons.find((person) => person.id === id);
  if (person) {
    res.status(200).json(person);
  } else {
    res.status(404).end();
  }
});

app.get("/info", (req, res) => {
  const date = new Date();
  console.log(date);
  res.send(`<p>Phonebook has info for ${persons.length} people</p>${date}<p>`);
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const personToRemove = persons.find((person) => person.id === id);
  const filteredArray = persons.filter((person) => person.id !== id);
  console.log("deleted person: ", personToRemove);
  persons = filteredArray;
  res.status(204).end();
});

app.post("/api/persons", (req, res) => {
  console.log("body received: ", req.body);
  const name = req.body.name;
  const number = req.body.number;
  if (!name) {
    return res.status(400).json({ error: "name property missing" });
  }
  if (!number) {
    return res.status(400).json({ error: "number property missing" });
  }
  if (persons.find((person) => person.name === name)) {
    return res.status(400).json({ error: "name must be unique" });
  }
  let id = "1";
  while (persons.find((person) => person.id === id)) {
    console.log(`id ${id} already exists. generating new one`);
    id = Math.floor(Math.random() * 10000);
  }
  const personToAdd = { id: id, name: name, number: number };
  persons = persons.concat({ id: id, name: name, number: number });
  res.status(201).json(personToAdd);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
