import { useState } from "react";

const Filter = ({ filter, handler }) => (
  <div>
    filter shown with <input value={filter} onChange={handler} />
  </div>
);

const PersonForm = ({ name, number, submit, nameHandler, numberHandler }) => (
  <form onSubmit={submit}>
    <h3>add a new</h3>
    <div>
      name: <input value={name} onChange={nameHandler} />
    </div>
    <div>
      number: <input value={number} onChange={numberHandler} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
);

const PersonList = ({ persons }) => (
  <div>
    {persons.map((person) => (
      <Person key={person.name} name={person.name} number={person.number} />
    ))}
  </div>
);

const Person = ({ name, number }) => (
  <div>
    {name} {number}
  </div>
);

const App = () => {
  const [persons, setPersons] = useState([
    { name: "Arto Hellas", number: "040-123456" },
    { name: "Ada Lovelace", number: "39-44-5323523" },
    { name: "Dan Abramov", number: "12-43-234345" },
    { name: "Mary Poppendieck", number: "39-23-6423122" },
  ]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [filteredList, setFilteredList] = useState(persons);

  const addPerson = (event) => {
    event.preventDefault();
    if (persons.some((person) => person.name === newName)) {
      alert(`${newName} is already added to phonebook`);
      return;
    }
    const copy = [{ name: newName, number: newNumber }, ...persons];
    setPersons(copy);
    setNewName("");
    setNewNumber("");
    console.log(copy);
    setFilteredList(
      copy.filter((person) =>
        person.name.toLowerCase().includes(nameFilter.toLowerCase())
      )
    );
  };

  const handleFilterChange = (event) => {
    setNameFilter(event.target.value);
    setFilteredList(
      persons.filter((person) =>
        person.name.toLowerCase().includes(event.target.value.toLowerCase())
      )
    );
    const copy = filteredList;
    console.log(copy);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleNameChange = (event) => {
    console.log("event.target.value", event.target.value);
    setNewName(event.target.value);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={nameFilter} handler={handleFilterChange} />
      <PersonForm
        name={newName}
        number={newNumber}
        submit={addPerson}
        nameHandler={handleNameChange}
        numberHandler={handleNumberChange}
      />
      <h3>Numbers</h3>
      <PersonList persons={filteredList} />
    </div>
  );
};

export default App;
