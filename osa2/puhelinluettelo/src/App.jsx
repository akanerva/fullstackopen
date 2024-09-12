import { useState } from "react";

const Person = ({ name }) => <div>{name}</div>;

const App = () => {
  const [persons, setPersons] = useState([{ name: "Arto Hellas" }]);
  const [newName, setNewName] = useState("");

  const addName = (event) => {
    event.preventDefault();
    if (persons.some((person) => person.name === newName)) {
      alert(`${newName} is already added to phonebook`);
      return;
    }
    console.log("klik", event.target);
    setPersons([{ name: newName }, ...persons]);
    setNewName("");
    console.log("persons: ", persons);
  };

  const handleNameChange = (event) => {
    console.log("event.target.value", event.target.value);
    setNewName(event.target.value);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addName}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {persons.map((person) => (
        <Person key={person.name} name={person.name} />
      ))}
    </div>
  );
};

export default App;
