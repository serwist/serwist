import { Welcome } from "../welcome/welcome";

export function meta() {
  return [
    { title: "About" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function About() {
  return <Welcome />;
}
