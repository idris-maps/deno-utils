const files = [
  {
    file: "layout-config.yaml",
    content: `
css:
  - "/assets/style.css"
  - "/assets/svg.css"
scripts:
  - "/assets/svg.js"
    `.trim(),
  },
  {
    file: "forms/todos.yaml",
    content: `
label: Todos
fields:
  - type: text
    property: todo
    label: Thing to do
  - type: select
    property: category
    label: Category
    options:
      - Private
      - Work
  - type: checkbox
    property: done
    label: Done
    `.trim(),
  },
  {
    file: "pages/index.md",
    content: `
# Hello {{query.name | world}}

The title above depends on the query parameter \`name\`, [change it](/?name=you).

## Todos

\`\`\`form
name: todos
submitLabel: Add thing to do
redirect: /
\`\`\`

After submitting todos that are not "done" will be shown below.

\`\`\`form-table
form: todos
columns:
  - todo 
  - category
filters:
  - done = false
\`\`\`

Data can be updated on the [admin page](/admin/forms/todos).    
    `,
  },
];

export const createExampleFiles = () =>
  Promise.all(
    files.map(({ file, content }) => Deno.writeTextFile(file, content)),
  );
