import ConvertConstants from "@/public/constants/convert.constants";
import { convertPureFunction } from "@/public/functions/convert.functions";
import Editor from "@monaco-editor/react";
import { useState } from "react";

export default function Home() {
  const [keyword, setKeyword] = useState<string | undefined>(
    ConvertConstants.DEFAULT_KEYWORD
  );
  const [code, setCode] = useState<string | undefined>();
  const [result, setResult] = useState<string | undefined>();

  const handleChangeCode = (value: string | undefined) => setCode(() => value);

  const handleChangeKeyword = (event: any) =>
    setKeyword(() => event.target.value);

  const handleCodeConvert = () => {
    if (code) {
      const result: string = convertPureFunction(code, keyword);

      setResult(() => result);
    }
  };

  return (
    <div className="flex flex-col items-center h-screen w-screen bg-[#2e343d]">
      <h1 className="mt-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
        Pure Function Converter
      </h1>

      <div className="mt-4 ml-4 self-start">
        <p className="text-white">Inpure keyword</p>

        <input
          type="text"
          id="first_name"
          className="mt-4 p-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Keyword"
          value={keyword}
          onChange={handleChangeKeyword}
        />
      </div>

      <div className="flex flex-row items-center h-3/4 w-screen">
        <div className="h-3/4 w-full cursor-text">
          <Editor theme="vs-dark" value={code} onChange={handleChangeCode} />
        </div>
        <div className="h-3/4 w-full cursor-text">
          <Editor language="typescript" theme="vs-dark" value={result} />
        </div>
      </div>

      <button
        className="w-[300px] bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleCodeConvert}
      >
        Convert
      </button>
    </div>
  );
}
