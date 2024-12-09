import { useState } from 'react';
import './App.css';
import { Scanner } from "./parse";
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { Options, termToString, nG } from './code';

function App() {
  const [inputA, setInputA] = useState("");
  const [output, setOutput] = useState("出力：");
  const [outputError, setOutputError] = useState("");
  const [options, setOptions] = useState<Options>({
    checkOnOffo: false,
    checkOnOffO: false,
    checkOnOffA: false,
    checkOnOffB: false,
    checkOnOffT: false,
  });
  const [showHide, setShowHide] = useState(false);

  const compute = () => {
    setOutput("");
    setOutputError("");
    try {
      const x = inputA ? new Scanner(inputA).parse_term() : null;
      if (x === null) throw Error("Aの入力が必要です");
      const outputString = termToString(nG(x),options);
      setOutput(`出力：${options.checkOnOffT ? `$${outputString}$` : outputString}`);
    } catch (error) {
      if (error instanceof Error) setOutputError(error.message);
      else setOutputError("不明なエラー");
      console.error("Error in compute:", error);
    }
  };

  const handleCheckboxChange = (key: keyof Options) => {
    setOptions((prevOptions) => ({
      ...prevOptions,
      [key]: !prevOptions[key],
    }));
  };

  return (
    <div className="app">
      <header>nG配列変換</header>
      <main>
        <p className="rdm">
          入力は、任意の0 &lt; nに対して、ψ(a_n,a_&#123;n-1&#125;,...,a_2,a_1,a_0), ψ_&#123;a_n&#125;(a_a_&#123;n-1&#125;,...,a_2,a_1,a_0)の形式で行ってください。<br />
          _, &#123;, &#125;は省略可能です。<br />
          略記として、1 := ψ(0), n := 1 + 1 + ...(n個の1)... + 1, ω := ψ(1), Ω := ψ(1,0), I := ψ(1,0,0)が使用可能。<br />
          また、ψはpで、ωはwで、ΩはWで代用可能。
        </p>
        A:
        <input
          className="input is-primary"
          value={inputA}
          onChange={(e) => setInputA(e.target.value)}
          type="text"
          placeholder="入力A"
        />
        <div className="block">
          <button className="button is-primary" onClick={() => compute()}>
            変換
          </button>
        </div>
        <input type="button" value="オプション" onClick={() => setShowHide(!showHide)} className="button is-primary is-light is-small" />
        {showHide && (
          <ul>
            <li><label className="checkbox">
              <input type="checkbox" checked={options.checkOnOffo} onChange={() => handleCheckboxChange('checkOnOffo')} />
              &nbsp;ψ_0(1)をωで出力
            </label></li>
            <li><label className="checkbox">
              <input type="checkbox" checked={options.checkOnOffO} onChange={() => handleCheckboxChange('checkOnOffO')} />
              &nbsp;ψ_1(0)をΩで出力
            </label></li>
            <li><label className="checkbox">
              <input type="checkbox" checked={options.checkOnOffA} onChange={() => handleCheckboxChange('checkOnOffA')} />
              &nbsp;ψ_a(b)をψ(a,b)で表示
            </label></li>
            <li><label className="checkbox">
              <input type="checkbox" checked={options.checkOnOffB} onChange={() => handleCheckboxChange('checkOnOffB')} />
              &nbsp;ψ_0(b)をψ(b)で表示
            </label></li>
            <li><label className="checkbox">
              <input type="checkbox" checked={options.checkOnOffT} onChange={() => handleCheckboxChange('checkOnOffT')} />
              &nbsp;TeXで出力
            </label></li>
          </ul>
        )}
        <div className="box is-primary">
          {outputError !== "" ? (
            <div className="notification is-danger">{outputError}</div>
          ) : (
            <div>
              <ReactMarkdown
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex]}
              >
                {output}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </main>
      <footer>
        <a href="https://googology.fandom.com/ja/wiki/%E3%83%A6%E3%83%BC%E3%82%B6%E3%83%BC%E3%83%96%E3%83%AD%E3%82%B0:%E7%AB%B9%E5%8F%96%E7%BF%81/nG%E9%85%8D%E5%88%97%E5%A4%89%E6%8F%9B" target="_blank" rel="noreferrer">ユーザーブログ:竹取翁/nG配列変換 | 巨大数研究 Wiki | Fandom</a>(2024/12/06 閲覧)<br />
        このページは<a href="https://creativecommons.org/licenses/by-sa/3.0/legalcode" target="_blank" rel="noreferrer">Creative Commons Attribution-ShareAlike 3.0 Unported License</a>の下に公開されます。<br />
      </footer>
    </div>
  );
}

export default App;