/**  @jsx h */
import { h } from "../mod.ts";

export default (name = "world") => (
  <div>
    <h1>Hello</h1>
    {Array.from(name).map((d) => <p>{d}</p>)}
  </div>
);
