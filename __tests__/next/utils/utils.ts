export const getURLFromLog = (message: string) => {
  if (message.includes("- Local:")) {
    return message.match(/\s*- Local:\s*(.+)\n/)?.[1];
  }
  return undefined;
};
