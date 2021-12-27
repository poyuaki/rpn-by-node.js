/**
 * 逆ポーランド記法に変換しつつ、それを計算するプログラム。
 * 
 * == 注意 ==
 * ある程度の式ならまともに動くとは思いますが、結構不完全なのでご注意を。
 * 特に、データの整合性チェックをしてないので、適当な文字列を打ち込むとバグります。
**/

const operatorList = ['+', '-', '*', '/'] // 演算子

/**
 * 演算子かどうかを判定する関数
 * @param {string} val 文字
 * @returns {bool} 判定結果
 */
function isOperator (val) {
  return operatorList.indexOf(val) !== -1
}

/**
 * 丸括弧かどうかを判定する関数
 * 
 * @param {string} val 文字
 * @returns {bool} 判定結果
 */

function isBracket (val) {
  return val === '(' || val === ')'
}

/**
 * 演算子と数値を配列に分割する関数
 * @param {string} formula  計算式
 * @returns {array} 分割した配列
 */
function setOperatorAndNum (formula) {
  let res = []
  let add = ''
  let flag = false
  for (let i = 0; i < formula.length; i++) {
    const val = formula.substring(i, i + 1)
    if (!isOperator(val) && !isBracket(val)) {
      add += val
    } else {
      if (add !== '') {
        if (val === ')' && flag) {
          add = '-' + add
          flag = false
        }
        res.push(add) // 数値があったら
      }
      if (res[res.length - 1] === '(' && val === '-') { // 演算子があったら
        flag = true
        continue
      } else {
        res.push(val)
      }
      add = ''
    }
  }
  if (add !== '') res.push(add)
  return res
}

/**
 * 演算子の優先度を返す関数
 * @param {string} val 演算子
 * @returns {number} 優先度
 */
function importantceNum (val) {
  if (isBracket(val)) return 4
  if (val === '*' || val === '/') return 3
  if (val === '+' || val === '-') return 2
  else return 1
}

/**
 * 
 * @param {string} ope 演算子
 * @param {string} val1 値1
 * @param {string} val2 値2
 * @returns {number} 計算結果
 */
function calc (ope, val1, val2) {
  if (ope === '+') return val1 + val2
  if (ope === '-') return val2 - val1
  if (ope === '*') return val1 * val2
  if (ope === '/') return val2 / val1
}


/**
 * 中置記法を逆ポーランド記法に変換する関数
 * @param {string} formula 計算式
 * @returns {array} 逆ポーランド記法
 */
function formatReversePolishNonation (formula) {
  let res = [] // 結果を格納する配列
  let stock = [] // ストック用配列
  let valList = setOperatorAndNum(formula) // 演算子と数値を分割した配列
  let flag = false // 初回かどうかのフラグ(演算子)
  for (let i = 0; i < valList.length; i++) {
    const val = valList[i]
    if (val === '') continue // よくわからん原因で空白が出るのでとりまcontinue
    if (!isOperator(val) && !isBracket(val)) { // もしも数値なら
      res.push(val) // とりまAdo
      if (stock.length) res.push(stock.pop()) // 演算子がスタックされてたらそれをresにpush
    } else if (isOperator(val)) { // 演算子なら
      // 優先度による調整
      if (flag && importantceNum(val) > importantceNum(res[res.length - 1])) stock.push(res.pop())
      flag = true
      stock.push(val) // Ado
    } else if (isBracket(val)) { // 丸括弧なら
      const startIndex = i + 1 // 切り取り開始をするindex
      let nestCount = 0 // 丸括弧のネストの数
      let endIndex = 0 // 切り取り終了をするindex(ただしそのindexは含まない)
      for (let j = i; j < valList.length; j++) { // ネストを考慮して最後の丸括弧までを探す
        if (valList[j] === '(') nestCount++
        if (valList[j] === ')') nestCount--
        if (nestCount === 0) {
          endIndex = j
          break
        }
      }
      const subFormula = valList.slice(startIndex, endIndex).join('') // 丸括弧内の文字列を取得
      res.push(...formatReversePolishNonation(subFormula)) // 丸括弧内の計算式を逆ポーランドに変換
      if (stock.length) res.push(stock.pop()) // 演算子がスタックされてたらそれをresにpush
      i = endIndex // ショートカット。ついでに俺はボブ派
    }
  }
  // 薙ぎ払え！！(スタックされてる演算子をresにpushの訳)
  for (let i = 0; i < stock.length; i++) res.push(stock[i])
  return res
}

/**
 * 逆ポーランド記法の計算を行う関数
 * @param {array} rpnArr 逆ポーランド記法
 * @returns {number} 計算結果
 */
function RpnCalc (rpnArr) {
  let stack = []
  for (let i = 0; i < rpnArr.length; i++) {
    const val = rpnArr[i]
    if (!isOperator(val)) stack.push(val)
    else stack.push(calc(val, Number(stack.pop()), Number(stack.pop())))
  }
  return stack[0]
}

// I/0関係
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})

readline.question('式を入力 : ', formula => {
  console.log(`元の計算式 : ${setOperatorAndNum(formula)}`)
  
  const rpnArr = formatReversePolishNonation(formula) // 逆ポーランド記法

  console.log(`RPN : ${rpnArr.join(' ')}`)

  console.log('計算結果 : ' + RpnCalc(rpnArr))
})

