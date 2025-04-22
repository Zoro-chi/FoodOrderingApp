const tintColorLight = "#2f95dc";
const tintColorDark = "#2f95dc"; // Use same tint color for consistency

export default {
  light: {
    text: "#000",
    background: "#fff",
    tint: tintColorLight,
    tabIconDefault: "#ccc",
    tabIconSelected: tintColorLight,
    cardBackground: "#fff",
    inputBackground: "gainsboro",
    placeholderText: "#777",
    dangerColor: "#d9534f",
    headerBackground: "#fff",
    border: "#e1e1e1",
  },
  dark: {
    text: "#fff",
    background: "#121212",
    tint: tintColorDark,
    tabIconDefault: "#ccc",
    tabIconSelected: tintColorDark,
    cardBackground: "#1e1e1e",
    inputBackground: "#333",
    placeholderText: "#aaa",
    dangerColor: "#ff6b6b",
    headerBackground: "#1e1e1e",
    border: "#333",
  },
};
