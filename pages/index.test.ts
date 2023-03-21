import ConvertConstants from "../public/constants/convert.constants";
import { convertPureFunction } from "../public/functions/convert.functions";
import { expect, test } from "@jest/globals";

test("Convert inpure function to pure", (): void => {
  const input: string = `const calculate = () => {/n
    this.average = 2 + 6 / 2;/n
    /n
    this.result = this.average * 5;/n
  }`;

  const result: string = convertPureFunction(
    input,
    ConvertConstants.DEFAULT_KEYWORD
  );

  const functions: string[] = [
    "const getAverage = (param1: any, param2: any, param3: any) => {",
    "const getResult = (param1: any, param2: any) => {",
  ];

  functions.forEach((func: string) => expect(result).toContain(func));
});
