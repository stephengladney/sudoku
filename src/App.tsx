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

const VIEWS = ["SELECT_DIFFICULTY", "PLAY_GAME"] as const

function getDifficultyColor(difficulty: number) {
  if (difficulty < 20) return "range-info"
  if (difficulty < 30) return "range-accent"
  if (difficulty < 40) return "range-success"
  if (difficulty < 50) return "range-warning"
  return "range-error"
}

type View = (typeof VIEWS)[number]

function App() {
  const [board, setBoard] = useState<Board>()
  const [uiBoard, setUiBoard] = useState<UIBoard>([])
  const [indexBeingEdited, setIndexBeingEdited] = useState<number | null>()
  const [numberToGuess, setNumberToGuess] = useState<number>()
  const [difficulty, setDifficulty] = useState<number>(30)
  const [view, setView] = useState<View>("SELECT_DIFFICULTY")

  useEffect(() => {
    setTimeout(() => {
      const newBoard = createBoard()
      setBoard(newBoard)
    }, 500)
  }, [])

  const handleStartGameClick = () => {
    const numberToHide = difficulty
    getUiBoard(board!, Number(numberToHide)).then((uiBoard) =>
      setUiBoard(uiBoard)
    )
    setView("PLAY_GAME")
  }

  const handleNumberGuess = (n?: number) => {
    if (n) {
      const newUiBoard = [...uiBoard]
      newUiBoard[indexBeingEdited!] = n + "!"
      setIndexBeingEdited(null)
      setUiBoard(newUiBoard)
    }
  }

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
      {/* LOADING SCREEN */}
      {!board && (
        <div className="h-screen flex items-center justify-center">
          <h1 className="font-bold text-[6rem]">Sudoku</h1>
        </div>
      )}
      {/* SELECT DIFFICULTY SCREEN */}
      {!!board && view === "SELECT_DIFFICULTY" && (
        <div className="flex flex-col text-left w-screen h-screen items-center justify-center lg:w-[800px] lg:m-auto">
          <h3 className="font-bold text-6xl mb-4 text-center">
            Select your difficulty
          </h3>
          <div className="w-full py-8 px-8">
            <input
              type="range"
              min={0}
              max={80}
              onChange={(e) => setDifficulty(Number(e.target.value))}
              className={`range ${getDifficultyColor(difficulty)}`}
              value={difficulty}
            />
          </div>
          <button
            className="mt-4 text-white disabled:bg-slate-400"
            disabled={!difficulty && !!board}
            onClick={handleStartGameClick}
          >
            Start Game
          </button>
        </div>
      )}
      {/* GAMEPLAY SCREEN */}
      {view === "PLAY_GAME" && !!uiBoard.length && (
        <>
          <div className="grid grid-cols-10 grid-rows-10 border-[3px] border-solid border-black h-[100vw] bg-white max-w-[800px] max-h-[800px] lg:mx-auto lg:mt-2">
            {uiBoard.map((number, i) => (
              <div
                className={`flex justify-center items-center border-[1px] border-solid border-black font-bold text-3xl md:text-4xl lg:text-5xl  ${
                  isUserInputted(number) ? "text-blue-500" : ""
                } ${
                  canEdit(number)
                    ? "cursor-pointer hover:bg-blue-200"
                    : "cursor-default"
                }`}
                key={`number-${i}`}
                onClick={() => {
                  if (canEdit(number)) {
                    setIndexBeingEdited(i)
                    // @ts-ignore
                    window.my_modal_1.showModal()
                  }
                }}
              >
                {getNumberToDisplay(number)}
              </div>
            ))}
          </div>
          <button className="mt-5 text-white" onClick={handleCheckAnswersClick}>
            Check answers
          </button>
        </>
      )}
      {/* NUMBER INPUT MODAL */}
      <dialog id="my_modal_1" className="modal">
        <form
          method="dialog"
          className="modal-box"
          onSubmit={() => handleNumberGuess(numberToGuess)}
        >
          <h3 className="font-bold text-2xl text-white">Enter number</h3>
          <input
            className="w-24 text-4xl mt-2 text-white text-center font-bold"
            type="number"
            min={0}
            max={9}
            maxLength={1}
            onChange={(e) => setNumberToGuess(Number(e.target.value))}
            step={1}
          />
        </form>
      </dialog>
    </>
  )
}

export default App
