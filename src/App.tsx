import { useEffect, useState } from "react"
import {
  canEdit,
  createBoard,
  getUiBoardAsNumberArray,
  getNumberToDisplay,
  getUiBoard,
  isUserInputted,
  getBoardAsNumberArray,
} from "./lib/sudoku"
import type { Board, UIBoard } from "./lib/sudoku"
import "./App.css"
import { isEqual } from "gladknee"

function App() {
  const [board, setBoard] = useState<Board>()
  const [uiBoard, setUiBoard] = useState<UIBoard>([])
  const [indexBeingEdited, setIndexBeingEdited] = useState<number | null>()

  useEffect(() => {
    setTimeout(() => {
      const newBoard = createBoard()
      setBoard(newBoard)
      const numberToHide = prompt("How many squares do you want to hide?")
      getUiBoard(newBoard, Number(numberToHide)).then((uiBoard) =>
        setUiBoard(uiBoard)
      )
    }, 1000)
  }, [])

  useEffect(() => {
    if (indexBeingEdited) {
      setTimeout(() => {
        const newValue = prompt("Enter value")
        if (!newValue) return
        if (Number(newValue) < 0 || Number(newValue) > 9) {
          return alert("Invalid number")
        }
        const newUiBoard = [...uiBoard]
        newUiBoard[indexBeingEdited] = Number(newValue) + "!"
        setIndexBeingEdited(null)
        setUiBoard(newUiBoard)
      }, 500)
    }
  }, [indexBeingEdited])

  const handleCheckAnswersClick = () => {
    if (board) {
      const trueBoard = getBoardAsNumberArray(board)
      const userBoard = getUiBoardAsNumberArray(uiBoard)
      if (isEqual(trueBoard, userBoard)) {
        alert("You win!")
      } else {
        alert("Not quite. Try again")
      }
    }
  }

  return (
    <>
      {!uiBoard.length && <h1>Loading...</h1>}
      <div className="grid grid-cols-10 grid-rows-10 border-[3px] border-solid border-black">
        {uiBoard &&
          uiBoard.map((number, i) => (
            <div
              className={`border-[1px] border-solid border-black py-3 px-5 font-bold text-4xl ${
                indexBeingEdited === i ? "bg-slate-300" : ""
              } ${isUserInputted(number) ? "text-blue-500" : ""}`}
              key={`number-${i}`}
              onClick={() => {
                if (canEdit(number)) setIndexBeingEdited(i)
              }}
            >
              {getNumberToDisplay(number)}
            </div>
          ))}
      </div>
      {!!uiBoard.length && (
        <button className="mt-5 text-white" onClick={handleCheckAnswersClick}>
          Check answers
        </button>
      )}
    </>
  )
}

export default App
