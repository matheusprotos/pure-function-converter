import { convertPureFunction } from "@/public/functions/convert.functions";
import Editor from "@monaco-editor/react";
import { useState } from "react";

export default function Home() {
  const [code, setCode] = useState<string | undefined>();
  const [result, setResult] = useState<string | undefined>();

  const handleChangeCode = (value: string | undefined) => setCode(() => value);

  const handleCodeConvert = () => {
    if (code) {
      const result: string = convertPureFunction(code);

      setResult(result);
    }
  };

  return (
    <div className="flex flex-col items-center h-screen w-screen bg-[#2e343d]">
      <h1 className="mt-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
        Pure Function Converter
      </h1>

      <div className="flex flex-row items-center h-[800px] w-screen">
        <div className="h-3/4 w-full cursor-text">
          <Editor theme="vs-dark" value={code} onChange={handleChangeCode} />
        </div>
        <div className="h-3/4 w-full cursor-text">
          <Editor language="typescript" theme="vs-dark" value={result} />
        </div>
      </div>

      <button
        className="w-[500px] bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleCodeConvert}
      >
        Convert
      </button>
    </div>
  );
}
