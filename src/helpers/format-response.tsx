export const formatResponse = (response: string): JSX.Element[] => {
  const paragraphs = response.split("\n");

  let isWritingCode = false;

  const paragraphsAsJsx = paragraphs
  .map((line, index) => {
    if (line === "```") {
      isWritingCode = !isWritingCode;

      return null;
    }

    if (isWritingCode) {
      return <p className="code" key={index}>{line}</p>
    } else {
      if (line.match(/^[0-9]+\./g)) {// starts with a number and period, ie 1. or 30.
        return <p className="list-item" key={index}>{line}</p>
      } else {
        return <p className="text" key={index}>{line}</p>
      }
    }
  })
  .filter(element => !!element) as JSX.Element[];

  return paragraphsAsJsx;
}