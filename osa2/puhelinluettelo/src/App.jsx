import { useState, useEffect } from "react";
import personService from "./services/persons";

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

const PersonList = ({ persons, handleDelete }) => {
  return (
    <div>
      {persons.map((person) => (
        <Person
          key={person.name}
          name={person.name}
          number={person.number}
          id={person.id}
          handleDelete={handleDelete}
        />
      ))}
    </div>
  );
};

const Person = ({ name, number, id, handleDelete }) => {
  return (
    <li>
      {name} {number} <button onClick={() => handleDelete(id)}>delete</button>
    </li>
  );
};

const Notification = ({ message }) => {
  if (message == null) {
    return <></>;
  }
  console.log("message.error: ", message.error);
  const messageStyle =
    message.error === true
      ? {
          backgroundColor: "LightGrey",
          color: "red",
          borderStyle: "solid",
          borderRadius: "4px",
          padding: "10px",
          marginBottom: "10px",
        }
      : {
          backgroundColor: "LightGrey",
          color: "ForestGreen",
          borderStyle: "solid",
          borderRadius: "4px",
          padding: "10px",
          marginBottom: "10px",
        };
  return <div style={messageStyle}>{message.text}</div>;
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [filteredList, setFilteredList] = useState([]);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    personService.getAll().then((res) => {
      console.log("getAll response: ", res);
      setPersons(res);
      setFilteredList(res);
    });
  }, []);

  const addPerson = (event) => {
    event.preventDefault();
    if (persons.some((person) => person.name === newName)) {
      if (
        window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        const personToUpdate = persons.find(
          (person) => person.name === newName
        );
        const updatedPerson = {
          number: newNumber,
          name: personToUpdate.name,
          id: personToUpdate.id,
        };
        console.log("updatedPerson", updatedPerson);
        personService.update(personToUpdate.id, updatedPerson).then((res) => {
          console.log("update res", res);
          const copy = [
            res,
            ...persons.filter((person) => person.id !== personToUpdate.id),
          ];
          setPersons(copy);
          setNewName("");
          setNewNumber("");
          setFilteredList(
            copy.filter((person) =>
              person.name.toLowerCase().includes(nameFilter.toLowerCase())
            )
          );
          setMessage({ text: `Modified ${newName}`, error: false });
          setTimeout(() => {
            setMessage(null);
          }, 5000);
        });
      }
      return;
    }
    personService.create({ name: newName, number: newNumber }).then((res) => {
      console.log("personService.create res", res);
      const copy = [res, ...persons];
      setPersons(copy);
      setNewName("");
      setNewNumber("");
      setFilteredList(
        copy.filter((person) =>
          person.name.toLowerCase().includes(nameFilter.toLowerCase())
        )
      );
      setMessage({ text: `Added ${newName}`, error: false });
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    });
  };

  const deletePerson = (id) => {
    const person = persons.find((person) => person.id === id);
    if (window.confirm(`Delete ${person.name}?`)) {
      personService
        .deleteById(id)
        .then(() => {
          const newPersons = persons.filter((person) => person.id !== id);
          setPersons(newPersons);
          setFilteredList(
            newPersons.filter((person) =>
              person.name.toLowerCase().includes(nameFilter)
            )
          );
          setMessage({ text: `Removed ${person.name}`, error: false });
          setTimeout(() => {
            setMessage(null);
          }, 5000);
        })
        .catch((error) => {
          setMessage({
            text: `Person ${person.name} was already removed from server`,
            error: true,
          });
          setTimeout(() => {
            setMessage(null);
          }, 5000);
        });
    }
  };

  const handleFilterChange = (event) => {
    setNameFilter(event.target.value);
    setFilteredList(
      persons.filter((person) =>
        person.name.toLowerCase().includes(event.target.value.toLowerCase())
      )
    );
    const copy = filteredList;
    console.log("filteredList: ", copy);
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
      <Notification message={message} />
      <Filter filter={nameFilter} handler={handleFilterChange} />
      <PersonForm
        name={newName}
        number={newNumber}
        submit={addPerson}
        nameHandler={handleNameChange}
        numberHandler={handleNumberChange}
      />
      <h3>Numbers</h3>
      <PersonList persons={filteredList} handleDelete={deletePerson} />
    </div>
  );
};

export default App;
