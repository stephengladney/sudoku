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
import { isEqual, pauseAsync } from "gladknee"

const VIEWS = ["LOGO", "LOADING", "SELECT_DIFFICULTY", "PLAY_GAME"] as const

function getDifficultyColor(difficulty: number) {
  if (difficulty < 20) return "range-info"
  if (difficulty < 30) return "range-accent"
  if (difficulty < 40) return "range-success"
  if (difficulty < 50) return "range-warning"
  if (difficulty < 60) return "range-error"
  return "range-secondary"
}

type View = (typeof VIEWS)[number]

function App() {
  const [board, setBoard] = useState<Board>()
  const [uiBoard, setUiBoard] = useState<UIBoard>([])
  const [indexBeingEdited, setIndexBeingEdited] = useState<number | null>()
  const [numberToGuess, setNumberToGuess] = useState<number>()
  const [difficulty, setDifficulty] = useState<number>(30)
  const [view, setView] = useState<View>("LOGO")
  const [loadingPercent, setLoadingPercent] = useState(0)

  const animateLoadingPercent = async () => {
    for (let i = 0; i <= 100; i++) {
      await pauseAsync(25)
      setLoadingPercent((loadingPercent) => loadingPercent + 1)
    }
  }
  useEffect(() => {
    if (loadingPercent === 0) animateLoadingPercent()
    if (loadingPercent === 100) setView("SELECT_DIFFICULTY")
  }, [loadingPercent])

  const handleStartGameClick = () => {
    const numberToHide = difficulty
    setView("LOADING")
    setTimeout(async () => {
      const newBoard = createBoard()
      setBoard(newBoard)
      setUiBoard(getUiBoard(newBoard, Number(numberToHide)))
      setView("PLAY_GAME")
    }, 500)
  }

  const handleNumberGuess = (n?: number) => {
    if (n || n === 0) {
      const newUiBoard = [...uiBoard]
      newUiBoard[indexBeingEdited!] = n + "!"
      // setIndexBeingEdited(null)
      setUiBoard(newUiBoard)
      setNumberToGuess(undefined)
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

  const handleNewGameClick = () => {
    setView("SELECT_DIFFICULTY")
  }

  return (
    <>
      {/* LOADING SCREEN */}
      {view === "LOGO" && (
        <div className="h-screen flex flex-col items-center justify-center gap-3">
          <h1 className="font-bold text-[6rem] font-museo dark:text-slate-300 mt-[-15vh]">
            Sud<span className="loader"></span>ku
          </h1>
          <progress
            className="progress w-56"
            value={loadingPercent}
            max="100"
          ></progress>
        </div>
      )}
      {view === "LOADING" && (
        <div className="h-screen flex flex-col items-center justify-center">
          <span className="loader mb-4"></span>
          <h1 className="font-bold text-[3rem] font-museo dark:text-slate-300">
            Randomizing...
          </h1>
        </div>
      )}
      {/* SELECT DIFFICULTY SCREEN */}
      {view === "SELECT_DIFFICULTY" && (
        <div className="flex flex-col text-left w-screen h-screen items-center justify-center lg:w-[800px] lg:m-auto">
          <h3 className="font-bold text-6xl mb-4 text-center dark:text-slate-300">
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
            className="btn btn-success btn-wide mt-4 disabled:btn-disabled dark:btn-outline"
            disabled={!difficulty}
            onClick={handleStartGameClick}
          >
            Start Game
          </button>
        </div>
      )}
      {/* GAMEPLAY SCREEN */}
      {view === "PLAY_GAME" && !!uiBoard.length && (
        <>
          <div className="h-[100px] w-full bg-slate-600"></div>
          <h1 className="font-bold text-[4rem] lg:text-[6rem] font-museo dark:text-slate-300 my-4">
            Sudoku
          </h1>
          <div className="grid grid-cols-10 grid-rows-10 border-[3px] border-solid border-black  md:w-[550px] md:h-[550px] h-auto mx-auto dark:border-slate-500">
            {uiBoard.map((number, i) => (
              <div
                className={`flex justify-center items-center border-[1px] lg:border-2 border-solid border-black font-bold text-3xl md:text-4xl  dark:border-slate-500 ${
                  isUserInputted(number)
                    ? "text-blue-400 bg-blue-900"
                    : "text-slate-400"
                } ${
                  canEdit(number)
                    ? "cursor-pointer hover:bg-blue-200 dark:hover:bg-yellow-500 dark:hover:border-yellow-400 dark:hover:text-blue-800"
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
          {/* <div className="grid grid-cols-2 grid-rows-2 gap-4 p-4 items-center max-w-[550px] mx-auto">
            <button
              className="btn btn-success dark:btn-outline"
              onClick={handleCheckAnswersClick}
            >
              Submit
            </button>
            <button
              className="btn btn-secondary dark:btn-outline"
              onClick={handleNewGameClick}
            >
              New game
            </button>
            <button
              className="btn btn-warning dark:btn-outline"
              onClick={handleNewGameClick}
            >
              Hint
            </button>
            <button
              className="btn btn-error dark:btn-outline"
              onClick={handleNewGameClick}
            >
              Mistakes
            </button>
          </div> */}
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
            value={numberToGuess ?? ""}
          />
        </form>
        <form method="dialog" className="modal-backdrop opacity-5">
          <button>close</button>
        </form>
      </dialog>
    </>
  )
}

export default App
