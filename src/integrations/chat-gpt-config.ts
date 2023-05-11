import { fsInterface } from "../helpers/fs-interface";

const {
  readFile,
  writeFile,
  createFile,
  checkIfFileExists
} = fsInterface;

export type ConfigItem = {
  label: string;
  value: string;
}

export type Config = {
  persona: ConfigItem;
  model: ConfigItem;
  apiKey: ConfigItem;
};

const ephemeralApiKey = {
  label: "OpenAI API key",
  value: "",
};

const chatGPTConfigFileName = "chat-gpt-config.txt";

export const defaultConfig = {
  persona: {
    label: "AI Requests",
    value: ``
  },
  model: {
    label: "Model",
    value: "gpt-3.5-turbo",
  },
  apiKey: {
    label: "OpenAI API key",
    value: "",
  },
};

export const getConfig = async (): Promise<Config> => {
  const doesFileExist = await checkIfFileExists(chatGPTConfigFileName);

  if (!doesFileExist) {
    await createFile(chatGPTConfigFileName, JSON.stringify(defaultConfig));
  }

  try {
    let stringifiedConfig = await readFile(chatGPTConfigFileName);

    const config = {...JSON.parse(stringifiedConfig)}
  
    if (ephemeralApiKey.value !== "") {
      config.apiKey = ephemeralApiKey
    }
  
    return config;
  } catch (e: any) {
    throw new Error(e.message);
  }
};

export const setConfig = async (config: Config) => {
    await writeFile(chatGPTConfigFileName, JSON.stringify(config));
};

export const updateConfigWithSimpleValues = async (shouldSaveApiKey: boolean, persona?: string, model?: string, apiKey?: string) => {
  const {...config}: Config = await getConfig();

  if (persona) {
    config.persona.value = persona;
  }

  if (model) {
    config.model.value = model;
  }

  if (apiKey || apiKey === "") {
    if (shouldSaveApiKey) {
      config.apiKey.value = apiKey;
    } else {
      ephemeralApiKey.value = apiKey;
    }
  }

  await setConfig(config);
}