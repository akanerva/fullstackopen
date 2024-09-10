import { useState } from "react";

function randomIndex(max) {
  return Math.floor(Math.random() * max);
}

const App = () => {
  const handleVote = () => {
    const copy = [...points];
    copy[selected] += 1;
    setPoints(copy);

    // hae indeksi jonka takana suurin luku
    let index = 0;
    for (let i = 1; i < copy.length; i++) {
      if (copy[i] > copy[i - 1]) {
        index = i;
      }
    }
    // console.log("index: ", index);
    // console.log("points: ", copy);
    setWinner(index);
  };
  const anecdotes = [
    "If it hurts, do it more often.",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.",
    "The only way to go fast, is to go well.",
  ];

  const [selected, setSelected] = useState(randomIndex(anecdotes.length));
  const [points, setPoints] = useState(Array(anecdotes.length).fill(0));
  const [winner, setWinner] = useState(null);

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <div>{anecdotes[selected]}</div>
      <div>has {points[selected]} votes</div>
      <button onClick={handleVote}>vote</button>
      <button onClick={() => setSelected(randomIndex(anecdotes.length))}>
        next anecdote
      </button>
      <h1>Anecdote with most votes</h1>
      <div>{anecdotes[winner]}</div>
    </div>
  );
};

export default App;
