import { useState, useEffect } from "react";
import countryService from "./services/countries";

const Content = ({ filterText, countries, country, handleShow }) => {
  if (country) {
    return <Country country={country} />;
  }

  if (!countries) {
    console.log("countries is null");
    return <></>;
  }
  const filteredCountries = countries.filter((country) =>
    country.name.common.toLowerCase().includes(filterText.toLowerCase())
  );
  console.log("filteredCountries length: ", filteredCountries.length);

  if (filteredCountries.length === 1) {
    return <Country country={filteredCountries[0]} />;
  }
  if (filteredCountries.length > 10) {
    return <div>Too many matches, specify another filter</div>;
  }

  const countryNames = filteredCountries.map((country) => (
    <li key={country.name.common}>
      {country.name.common}{" "}
      <button onClick={() => handleShow(country)}>show</button>
    </li>
  ));

  return <div>{countryNames}</div>;
};

const Country = ({ country }) => {
  console.log("country prop: ", country);
  let languages = [];
  // eslint-disable-next-line no-unused-vars
  Object.entries(country.languages).forEach(([key, value]) => {
    languages.push(<li key={value}>{value}</li>);
  });

  return (
    <>
      <h2>{country.name.common}</h2>
      <div>
        capital {country.capital[0]}
        <br></br>
        area {country.area}
      </div>
      <h3>languages:</h3>
      <ul>{languages}</ul>
      <img src={country.flags.png}></img>
    </>
  );
};

function App() {
  const [filterText, setFilterText] = useState("");
  const [countries, setCountries] = useState(null);
  const [country, setCountry] = useState(null);

  useEffect(() => {
    countryService.getAll().then((countries) => {
      setCountries(countries);
      console.log(countries);
      console.log(countries[0]);
    });
  }, []);

  const handleFilterChange = (event) => {
    setFilterText(event.target.value);
    setCountry(null);
  };

  return (
    <>
      <div>
        find countries{" "}
        <input value={filterText} onChange={handleFilterChange}></input>
      </div>
      <Content
        filterText={filterText}
        countries={countries}
        country={country}
        handleShow={(country) => setCountry(country)}
      />
    </>
  );
}

export default App;
