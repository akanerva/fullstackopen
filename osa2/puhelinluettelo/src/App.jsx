import { useState } from "react";

const Person = ({ name, number }) => (
  <div>
    {name} {number}
  </div>
);

const PersonList = ({ persons }) => (
  <div>
    {persons.map((person) => (
      <Person key={person.name} name={person.name} number={person.number} />
    ))}
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
    console.log("klik", event.target);
    setPersons([{ name: newName, number: newNumber }, ...persons]);
    setNewName("");
    setNewNumber("");
    console.log("persons: ", persons);
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
      <div>
        filter shown with{" "}
        <input value={nameFilter} onChange={handleFilterChange} />
      </div>

      <form onSubmit={addPerson}>
        <h2>add a new</h2>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <PersonList persons={filteredList} />
    </div>
  );
};

export default App;
