import ConvertConstants from "../constants/convert.constants";

const operators: string[] = ["*", "+", "-", "/"];

const isolateCommands = (code: string): string[] => {
  let commands: string[] = [];
  commands = code.split("\n");
  commands = commands.filter((command: string) => command.includes(";"));

  return commands;
};

const removeExtraSpaces = (commands: string[]): string[] => {
  return commands.map((command: string) => {
    command = command.replace(/\s\s+/g, " ");
    command = command.trim();

    return command;
  });
};

const filterInpureCommands = (
  commands: string[],
  keyword: string | undefined
): string[] => {
  return commands.filter(
    (command: string) =>
      command.includes(keyword || ConvertConstants.DEFAULT_KEYWORD) &&
      command.includes("=")
  );
};

const getInpureVariableName = (
  command: string,
  keyword: string | undefined
): string => {
  const startIndex: number = command.indexOf(
    keyword || ConvertConstants.DEFAULT_KEYWORD
  );
  const endIndex: number = command.indexOf(" ");
  const inpureVariable: string = command.slice(startIndex, endIndex);

  return inpureVariable;
};

const defineFunctionName = (
  inpureVariable: string,
  keyword: string | undefined
): string => {
  inpureVariable = inpureVariable.replace(
    `${keyword || ConvertConstants.DEFAULT_KEYWORD}.`,
    ""
  );
  const capitalizedVariable: string =
    inpureVariable[0].toUpperCase() + inpureVariable.slice(1);

  return `get${capitalizedVariable}`;
};

const defineFunctionParams = (command: string): string[] => {
  let paramsPart: string = command.split("= ")[1];
  paramsPart = paramsPart.replace(";", "");

  let params: string[] = paramsPart.split(" ");
  params = params.filter((param: string) => !operators.includes(param));
  params = params.map(
    (name: string, index: number) => `param${index + 1}(${name})`
  );

  return params;
};

const defineFunctionReturn = (command: string): string => {
  let paramsPart: string = command.split("= ")[1];
  paramsPart = paramsPart.replace(";", "");

  let params: string[] = paramsPart.split(" ");
  params = params.map((name: string, index: number) => {
    let paramIndex: number = index + 1;

    paramIndex -= params.filter(
      (param: string, itemIndex: number) =>
        operators.includes(param) && itemIndex < index
    ).length;

    return operators.includes(name) ? name : `param${paramIndex}`;
  });

  const result = params.reduce((previous: string, current: string) => {
    const isFirstParam: boolean = previous.length === 0;

    return `${previous}${isFirstParam ? "" : " "}${current}`;
  }, "");

  return `${result};`;
};

const mountFunction = (
  functionName: string,
  functionParams: string[],
  functionReturn: string
): string => {
  let params: string = functionParams.reduce(
    (previous: string, current: string) => {
      const isFirstParam: boolean = previous.length === 0;

      current = current.split("(")[0];

      return `${previous}${isFirstParam ? "" : ", "}${current}: any`;
    },
    ""
  );

  return `const ${functionName} = (${params}) => {
    return ${functionReturn}
}`;
};

const purificateCommands = (
  commands: string[],
  keyword: string | undefined
): any[] => {
  const result: any = commands.map((command: string) => {
    const inpureVariable: string = getInpureVariableName(command, keyword);
    const functionName: string = defineFunctionName(inpureVariable, keyword);
    const functionParams: string[] = defineFunctionParams(command);
    const functionReturn: string = defineFunctionReturn(command);
    const purificatedMethod: string = mountFunction(
      functionName,
      functionParams,
      functionReturn
    );

    const newCommand = `${inpureVariable} = ${functionName}(${functionParams})`;

    return {
      method: purificatedMethod,
      command: newCommand,
    };
  });

  return result;
};

const buildMethods = (results: any[]): string => {
  const methods = results.map((result: any) => result.method);

  return methods.reduce((previous: any, current: any) => {
    const isFirstParam: boolean = previous.length === 0;

    return `${previous}${isFirstParam ? "" : "\n\n"}${current}`;
  }, "");
};

const buildCommands = (results: any[]): string => {
  results = results.map((result: any) => result.command);

  return results.reduce((previous: any, current: any) => {
    const isFirstParam: boolean = previous.length === 0;

    return `${previous}${isFirstParam ? "" : "\n\n"}//${current};`;
  }, "");
};

export const convertPureFunction = (
  input: string,
  keyword: string | undefined
) => {
  let commands = isolateCommands(input);
  commands = removeExtraSpaces(commands);
  commands = filterInpureCommands(commands, keyword);

  const results: any[] = purificateCommands(commands, keyword);

  const resultMethods: string = buildMethods(results);
  const resultCommands: string = buildCommands(results);

  return `
${resultMethods}

${resultCommands}
`;
};
