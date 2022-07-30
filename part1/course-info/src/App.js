// ttrimport logo from './logo.svg';
// import './App.css';

const Header = (props) => {
  return (
    <h1>{props.course}</h1>
  );
}

const Part = (props) => {
  return (
    <p>
      {props.name} {props.exercise}
    </p>
  );
}

const Content = (props) => {
  let parts = props.part

  return (
    <div>
      {parts.map(p => {
        return <Part name={p.name} exercise={p.exercises} />
      })}
    </div>
  );
}

const Total = (props) => {
  return (
    <p>Number of exercises {props.part.reduce((accum, currValue) => {
      return accum + currValue.exercises
    }, 0)}</p>
  );
}

function App() {

  const course ={
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }
  
  return (
    <div>
      <Header course={course.name} />
      <Content part={course.parts}/>
      <Total part={course.parts} />
    </div>
  );
}

export default App;
