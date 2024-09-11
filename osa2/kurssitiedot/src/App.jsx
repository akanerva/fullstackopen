const Course = ({ course }) => (
  <div>
    <Header name={course.name} />
    <Content parts={course.parts} />
  </div>
);

const Header = ({ name }) => <h1>{name}</h1>;

const Content = ({ parts }) => {
  let list = parts.map((part) => (
    <>
      <Part key={part.id} name={part.name} exercises={part.exercises} />
      <br></br>
    </>
  ));
  return <div>{list}</div>;
};

const Part = ({ name, exercises }) => (
  <div>
    {name} {exercises}
  </div>
);

const App = () => {
  const course = {
    name: "Half Stack application development",
    id: 1,
    parts: [
      {
        name: "Fundamentals of React",
        exercises: 10,
        id: 1,
      },
      {
        name: "Using props to pass data",
        exercises: 7,
        id: 2,
      },
      {
        name: "State of a component",
        exercises: 14,
        id: 3,
      },
    ],
  };

  return (
    <div>
      <Course course={course} />
    </div>
  );
};

export default App;
