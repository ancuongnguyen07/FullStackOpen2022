import React from "react";

const Header = ({ text }) => <h2>{text}</h2>

const Total = ({ sum }) => <b>total of {sum} exercises</b>

const Part = ({ part }) => <p key={part.id}>{part.name} {part.exercises}</p>

const Content = ({ parts }) => parts.map(part => <Part key={part.id} part={part} />)

const Course = ({ course }) => {
  const sum = course.parts.reduce((accum, val) => accum + val.exercises, 0)

  return (
    <div>
      <Header text={course.name} />
      <Content parts={course.parts} />
      <Total sum={sum} />
    </div>
  )
}

export default Course