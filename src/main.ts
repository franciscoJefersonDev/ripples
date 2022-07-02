import "./style.css";
import Ripples from "./Ripples";
type Options = {
  color: string;
  transition: number;
};

type RipplesConfig = {
  els: HTMLElement[];
  options: Options;
};

const app = document.querySelector<HTMLDivElement>("#app")!;
app.innerHTML = `
  <button>Click-me</button>
`;

const button = document.querySelector<HTMLButtonElement>("button")!;
const els: HTMLElement[] = [];
els.push(button);
const config: RipplesConfig = {
  els: els,
  options: {
    color: "rgba(0, 0, 0, 0.2)",
    transition: 200
  }
};
new Ripples(config);
