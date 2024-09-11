const Course = ({ course }) => (
  <div>
    <Header name={course.name} />
    <Content parts={course.parts} />
  </div>
);

const Header = ({ name }) => <h2>{name}</h2>;

const Content = ({ parts }) => {
  const list = parts.map((part) => (
    <Part key={part.id} name={part.name} exercises={part.exercises} />
  ));
  const total = parts
    .map((part) => part.exercises)
    .reduce((acc, current) => acc + current, 0);
  return (
    <>
      <div>{list}</div>
      <div>
        <b>total of {total} exercises</b>
      </div>
    </>
  );
};

const Part = ({ name, exercises }) => (
  <>
    <div>
      {name} {exercises}
    </div>
    <br></br>
  </>
);

const App = () => {
  const courses = [
    {
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
        {
          name: "Redux",
          exercises: 11,
          id: 4,
        },
      ],
    },
    {
      name: "Node.js",
      id: 2,
      parts: [
        {
          name: "Routing",
          exercises: 3,
          id: 1,
        },
        {
          name: "Middlewares",
          exercises: 7,
          id: 2,
        },
      ],
    },
  ];

  const courseList = courses.map((course, i) => (
    <Course key={i} course={course} />
  ));

  return (
    <div>
      <div>
        <h1>Web development curriculum</h1>
      </div>
      <div>{courseList}</div>
    </div>
  );
};

export default App;
