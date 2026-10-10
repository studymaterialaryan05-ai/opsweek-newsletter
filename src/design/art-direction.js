const PALETTES = {
  ink: "#14251f",
  paper: "#fbfaf5",
  lime: "#d8f36b",
  green: "#55765a",
  orange: "#ef8b55",
  blue: "#b9dbe0",
  muted: "#66756d",
  line: "#dce3da"
};

export function createArtDirection({ editionDate = "" } = {}) {
  return {
    editionDate,
    name: "OpsWeek Visual Studio",
    palette: PALETTES,
    typography: {
      display: "Georgia, 'Times New Roman', serif",
      body: "Arial, Helvetica, sans-serif",
      labelTracking: "1.15px"
    },
    principles: [
      "One dominant idea per page",
      "Short summaries before detailed analysis",
      "Use diagrams to explain processes, not as decoration",
      "Maintain contrast and print legibility",
      "Preserve source links and evidence caveats"
    ]
  };
}
