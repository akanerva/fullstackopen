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

export default Course;
