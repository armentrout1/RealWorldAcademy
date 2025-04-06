import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Set default title
document.title = "Real World Academy";

// Add Inter and Roboto fonts
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Roboto:wght@300;400;500&display=swap";
document.head.appendChild(fontLink);

// Add Font Awesome
const fontAwesome = document.createElement("link");
fontAwesome.rel = "stylesheet";
fontAwesome.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css";
document.head.appendChild(fontAwesome);

createRoot(document.getElementById("root")!).render(<App />);
