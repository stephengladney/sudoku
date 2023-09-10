import { getRange, randomNumber, shave, shuffle } from "gladknee"

export type Board = {
  "0": number[]
  "1": number[]
  "2": number[]
  "3": number[]
  "4": number[]
  "5": number[]
  "6": number[]
  "7": number[]
  "8": number[]
  "9": number[]
}

export type UIBoard = (number | string)[]

function getCurrentRowNumbers(
  board: Board,
  rowNumber: number,
  currentIndex: number
) {
  return board[String(rowNumber) as keyof typeof board]?.slice(0, currentIndex)
}

function getCurrentColumnNumbers(
  board: Board,
  rowNumber: number,
  currentIndex: number
) {
  const numbers = []
  for (let i = Number(rowNumber) - 1; i >= 0; i--) {
    numbers.push(board[String(i) as keyof typeof board][currentIndex])
  }
  return numbers
}

export function createBoard() {
  const board: Board = {
    "0": [],
    "1": [],
    "2": [],
    "3": [],
    "4": [],
    "5": [],
    "6": [],
    "7": [],
    "8": [],
    "9": [],
  }

  for (let i = 0; i < 10; i++) {
    // Iterate over rows
    const numbers = getRange(0, 9)
    let isOkay = false
    while (!isOkay) {
      const shuffled = shuffle(numbers!) // Create a shuffled version of 0-9
      board[String(i) as keyof typeof board] = shuffled
      for (let j = 0; j < 10; j++) {
        // Iterate over columns
        // Get used numbers for this row and this column
        const usedNumbers = [
          ...getCurrentColumnNumbers(board, i, j),
          ...getCurrentRowNumbers(board, i, j),
        ]
        if (usedNumbers.includes(shuffled[j])) {
          // If the number has already been used in the column or row, start over
          break
        } else if (j === 9) {
          // If the last column and no numbers have been used, move on to next row
          isOkay = true
        }
      }
    }
  }
  return board
}

export function getBoardAsNumberArray(board: Board) {
  const result: number[] = []
  Object.keys(board).forEach((key) => {
    result.push(...board[key as keyof typeof board])
  })
  return result
}

export function getUiBoardAsNumberArray(board: UIBoard) {
  return board.map((n) => {
    if (String(n).includes("!")) return Number(shave(String(n), 1))
    else if (n === "") return NaN
    else return Number(n)
  })
}

export function getUiBoard(board: Board, squaresToHide: number) {
  const boardNumbers: (number | string)[] = getBoardAsNumberArray(board)
  const removedIndexes: number[] = []
  let randomIndex = 0
  for (let i = 1; i <= squaresToHide; i++) {
    randomIndex = randomNumber(0, boardNumbers.length - 1)
    while (removedIndexes.includes(randomIndex)) {
      randomIndex = randomNumber(0, boardNumbers.length - 1)
    }
    boardNumbers[randomIndex] = "" // Set hidden numbers to ""
    removedIndexes.push(randomIndex)
  }
  return boardNumbers
}

export function isUserInputted(n: string | number) {
  return String(n).includes("!")
}

export function getNumberToDisplay(n: string | number) {
  if (isUserInputted(n)) return shave(String(n), 1) as string
  else return n
}

export function canEdit(n: string | number) {
  return n !== 0 && (!n || String(n).includes("!"))
}
