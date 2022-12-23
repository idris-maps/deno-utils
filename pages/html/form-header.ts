import { html } from "../deps.ts";

interface Props {
  left?: string;
  right?: string;
}

export const formHeader = ({ left = "", right = "" }: Props) =>
  html`
    <header class="form-header">
      <div class="left">
        ${left}
      </div>
      <div class="right">
        ${right}
      </div>
    </header>
  `;
