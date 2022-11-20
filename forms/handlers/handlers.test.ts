// deno-lint-ignore-file no-explicit-any

import { initFormHandlers } from "./mod.ts";
import { initDb } from "../db/mod.ts";
import {
  assertEquals,
  assertEquals as isEq,
} from "https://deno.land/std@0.163.0/testing/asserts.ts";
import type { ReqProps } from "./init-wrapper.ts";

const isTrue = (d: any, msg?: string) => assertEquals(d, true, msg);

const dbFilename = "test-handlers.db";

const db = await initDb(dbFilename);
const h = initFormHandlers(db);

window.onunload = () => {
  Deno.remove(dbFilename);
};

const DEFAULT_FORM = {
  name: "test",
  label: "TéSt",
  fields: [
    { type: "text", property: "a" },
    { type: "number", property: "b" },
  ],
};

const req = (d: Partial<ReqProps>): ReqProps => ({
  data: {},
  params: {},
  query: {},
  ...d,
});

// -- FORMS --

Deno.test("[handler] POST form", async () => {
  const fields = DEFAULT_FORM.fields;
  const name = DEFAULT_FORM.name + "_post";
  const label = DEFAULT_FORM.label;

  const res1 = await h.forms.post(req({ data: { fields } }));
  isEq(res1.status, 400, "should return 400 if name is missing");

  const res2 = await h.forms.post(req({ data: { name: label, fields } }));
  isEq(res2.status, 400, "should return 400 if name is invalid");

  const res3 = await h.forms.post(
    req({ data: { label: label + "$1", fields } }),
  );
  isEq(res3.status, 200, "should accept label instead of name");
  isEq(res3?.body?.name, "test_1", "should return valid name based on label");

  const res4 = await h.forms.post(req({ data: { name } }));
  isEq(res4.status, 400, "should return 400 if fields are missing");

  const res5 = await h.forms.post(
    req({ data: { name, fields: [...fields, { type: "text" }] } }),
  );
  isEq(res5.status, 400, "should return 400 if a field is missing property");

  const res6 = await h.forms.post(
    req({ data: { name, fields: [...fields, { property: "x" }] } }),
  );
  isEq(res6.status, 400, "should return 400 if a field is missing type");

  const res7 = await h.forms.post(req({ data: { name, label, fields } }));
  isEq(res7.status, 200);
  isEq(res7.body.name, name);
  isEq(res7.body.label, label);
  isEq(res7.body.fields.length, fields.length);
});

Deno.test("[handler] GET form", async () => {
  const name = DEFAULT_FORM.name + "_get_one";
  const form = { ...DEFAULT_FORM, name };

  await h.forms.post(req({ data: form }));

  const res1 = await h.forms.get(req({ params: { formName: "not-exist" } }));
  isEq(res1.status, 404, "should return 404 if not exists");

  const res2 = await h.forms.get(req({ params: { formName: name } }));
  isEq(res2.status, 200, "should return 200 if it does");
  isEq(res2.body.name, name);
  isEq(res2.body.label, form.label);
  isEq(res2.body.fields.length, form.fields.length);
});

Deno.test("[handler] GET schema", async () => {
  const name = DEFAULT_FORM.name + "_get_schema";
  const form = { ...DEFAULT_FORM, name };

  await h.forms.post(req({ data: form }));

  const res1 = await h.forms.getSchema(
    req({ params: { formName: "not-exist" } }),
  );
  isEq(res1.status, 404, "should return 404 if not exists");

  const res2 = await h.forms.getSchema(req({ params: { formName: name } }));
  isEq(res2.status, 200, "should return 200 if it does");
  isEq(res2.body.type, "object");
  isEq(Object.keys(res2.body.properties), form.fields.map((d) => d.property));
  isEq(res2.body.required, form.fields.map((d) => d.property));
});

Deno.test("[handler] GET forms", async () => {
  const form = { ...DEFAULT_FORM, name: DEFAULT_FORM.name + "_get_forms" };

  await h.forms.post(req({ data: form }));

  const res = await h.forms.list(req({}));
  isEq(res.status, 200, "should return 200");
  isTrue(Array.isArray(res.body), "should return an array");
  const names = res.body.map((d: any) => d.name);
  isTrue(names.includes(form.name), "should return created form");
});

Deno.test("[handler] PUT form", async () => {
  const name = DEFAULT_FORM.name + "_put";
  const form = { ...DEFAULT_FORM, name };

  await h.forms.post(req({ data: form }));

  const res1 = await h.forms.put(req({ params: { formName: "not-exist" } }));
  isEq(res1.status, 404, "should return 404 if not exists");

  const newLabel = "New label";
  const res2 = await h.forms.put(
    req({ params: { formName: name }, data: { label: newLabel } }),
  );
  isEq(res2.body.label, newLabel, "should update label");

  const invalidNewName = "Invalid name";
  const res3 = await h.forms.put(
    req({ params: { formName: name }, data: { name: invalidNewName } }),
  );
  isEq(res3.status, 400, "should return 400 if is invalid");

  const newName = "new_name";
  const res4 = await h.forms.put(
    req({ params: { formName: name }, data: { name: newName } }),
  );
  isEq(res4.body.name, newName);

  const res5 = await h.forms.put(req({
    params: { formName: newName },
    data: { fields: [...form.fields, { type: "number", property: "c" }] },
  }));
  isEq(res5.status, 400, "should return 400 if trying to update fields");
});

Deno.test("[handler] DELETE form", async () => {
  const name = DEFAULT_FORM.name + "_delete";
  const form = { ...DEFAULT_FORM, name };

  await h.forms.post(req({ data: form }));

  const res1 = await h.forms.delete(req({ params: { formName: "not-exist" } }));
  isEq(res1.status, 404, "should return 404 if not exists");

  const res2 = await h.forms.delete(req({ params: { formName: name } }));
  isEq(res2.status, 204, "should return 204 when deleted");

  const res3 = await h.forms.list(req({}));
  const names = res3.body.map((d: any) => d.name);
  isTrue(!names.includes(name), "should have deleted form from list");
});

// -- ROWS --

const formName = "rows_test";
const _form = {
  name: formName,
  fields: [
    { type: "range", property: "num", min: 0, max: 5, step: 1 },
    { type: "text", property: "txt" },
    { type: "checkbox", property: "bool" },
    { type: "select", options: ["one", "two"], property: "enum" },
  ],
};

const data = {
  num: 2,
  txt: "a",
  bool: false,
  enum: "one",
};

await h.forms.post(req({ data: _form }));

Deno.test("[handler] POST row", async () => {
  const res1 = await h.rows.post(req({ params: { formName: "no_exist" } }));
  isEq(res1.status, 404, "should return 404 if form does not exist");

  const res2 = await h.rows.post(req({ params: { formName } }));
  isEq(res2.status, 400, "should return 400 if no data");

  const res3 = await h.rows.post(
    req({ params: { formName }, data: { ...data, num: "a" } }),
  );
  isEq(res3.status, 400, "should return 400 if validation error");
  isEq(res3.body.message, "[validation error] num must be a number");

  const res4 = await h.rows.post(
    req({ params: { formName }, data: { ...data, num: 2.5 } }),
  );
  isEq(res4.status, 400, "should return 400 if validation error");
  isTrue(res4.body.message.includes("multiple of 1"));

  const res5 = await h.rows.post(req({ params: { formName }, data }));
  isEq(res5.status, 200, "should return 200 on success");
  isTrue(Boolean(res5.body.__id), "should return generated __id");

  const res6 = await h.rows.post(
    req({ params: { formName }, data: { ...data, bool: "true" } }),
  );
  isEq(res6.body.bool, true, "should accept boolean values as string");

  const res7 = await h.rows.post(
    req({ params: { formName }, data: { ...data, bool: "false" } }),
  );
  isEq(res7.body.bool, false, "should accept boolean values as string");
});

Deno.test("[handler] GET row", async () => {
  const { body } = await h.rows.post(req({ params: { formName }, data }));
  const { __id: rowId } = body;

  const res1 = await h.rows.get(
    req({ params: { formName: "no_exist", rowId } }),
  );
  isEq(res1.status, 404, "should return 404 if form does not exist");

  const res2 = await h.rows.get(
    req({ params: { formName, rowId: "no_exist" } }),
  );
  isEq(res2.status, 404, "should return 404 if row does not exist");

  const res3 = await h.rows.get(req({ params: { formName, rowId } }));
  isEq(res3.status, 200, "should return 200 if exists");
  isEq(res3.body, body, "should return row");
});

Deno.test("[handler] PUT row", async () => {
  const { body } = await h.rows.post(req({ params: { formName }, data }));
  const { __id: rowId } = body;

  const res1 = await h.rows.put(
    req({ params: { formName: "no_exist", rowId } }),
  );
  isEq(res1.status, 404, "should return 404 if form does not exist");

  const res2 = await h.rows.put(
    req({ params: { formName, rowId: "no_exist" } }),
  );
  isEq(res2.status, 404, "should return 404 if row does not exist");

  const res3 = await h.rows.put(
    req({ params: { formName, rowId }, data: { ...data, num: "a" } }),
  );
  isEq(res3.status, 400, "should return 400 if there is a validation error");

  const res4 = await h.rows.put(
    req({ params: { formName, rowId }, data: { ...data, num: 5 } }),
  );
  isEq(res4.status, 200, "should return 200 on success");
  isEq({ ...data, num: 5, __id: rowId }, res4.body, "should update row");
});

Deno.test("[handler] DELETE row", async () => {
  const { body } = await h.rows.post(req({ params: { formName }, data }));
  const { __id: rowId } = body;

  const res1 = await h.rows.delete(
    req({ params: { formName: "no_exist", rowId } }),
  );
  isEq(res1.status, 404, "should return 404 if form does not exist");

  const res2 = await h.rows.delete(
    req({ params: { formName, rowId: "no_exist" } }),
  );
  isEq(res2.status, 404, "should return 404 if row does not exist");

  const res3 = await h.rows.delete(req({ params: { formName, rowId } }));
  isEq(res3.status, 204, "should return 204 on success");

  const row = await h.rows.get(req({ params: { formName, rowId } }));
  isEq(row.status, 404, "should delete row");
});

Deno.test("[handler] GET rows", async () => {
  const formName = "test_list_rows";
  await h.forms.post(req({ data: { ..._form, name: formName } }));

  const rows = [
    { num: 1, txt: "a", bool: true, enum: "one" },
    { num: 2, txt: "b", bool: false, enum: "one" },
    { num: 3, txt: "a", bool: true, enum: "one" },
    { num: 4, txt: "a", bool: false, enum: "one" },
    { num: 5, txt: "b", bool: true, enum: "two" },
  ];

  await Promise.all(
    rows.map((data) => h.rows.post(req({ params: { formName }, data }))),
  );

  const res1 = await h.rows.list(req({ params: { formName: "no" } }));
  isEq(res1.status, 404, "should return 404 if form does not exist");

  const res2 = await h.rows.list(req({ params: { formName } }));
  isEq(res2.status, 200, "should return 200 if exists");
  isEq(res2.body.length, rows.length, "should return all rows");

  const all = res2.body;
  const run = (query: Record<string, string>) =>
    h.rows.list(req({ params: { formName }, query }));

  const res3 = await run({ limit: "2" });
  isEq(res3.body, [all[0], all[1]], "should limit");

  const res4 = await run({ limit: "1", offset: "2" });
  isEq(res4.body, [all[2]], "should offset");

  const res5 = await run({ sort: "num" });
  isEq(
    res5.body,
    all.sort((a: any, b: any) => a.num > b.num ? 1 : -1),
    "should sort ascending by default",
  );

  const res6 = await run({ sort: "num.desc" });
  isEq(
    res6.body,
    all.sort((a: any, b: any) => a.num > b.num ? -1 : 1),
    "should sort descending",
  );

  const res7 = await run({ "txt.eq": "b" });
  isTrue(
    res7.body.every((d: any) => d.txt === "b"),
    'should filter with "eq"',
  );

  const res8 = await run({ "num.lte": "3" });
  isTrue(
    res8.body.every((d: any) => d.num <= 3),
    'should filter with "lte"',
  );

  const res9 = await run({ "num.lte": "3", "txt.eq": "b" });
  isTrue(
    res9.body.every((d: any) => d.num <= 3 && d.txt === "b"),
    "should combine filters",
  );

  const res10 = await run({ "bool.eq": "false" });
  isTrue(
    res10.body.every((d: any) => !d.bool),
    "should filter boolean",
  );

  const res11 = await run({ "num.in": "1,2,3" });
  isTrue(
    res11.body.every((d: any) => [1, 2, 3].includes(d.num)),
    'should filter with "in"',
  );

  const res12 = await run({ "num.notIn": "1,2,3" });
  isTrue(
    res12.body.every((d: any) => ![1, 2, 3].includes(d.num)),
    'should filter with "notIn"',
  );

  await Promise.all(["aaa_hello_aaa", "aaa_hello", "hello_aaa"]
    .map((txt) =>
      h.rows.post(req({ params: { formName }, data: { ...data, txt } }))
    ));

  const res13 = await run({ "txt.like": "hello" });
  isTrue(
    res13.body.every((d: any) => d.txt.includes("hello")),
    'should filter with "like"',
  );

  const res14 = await run({ "txt.like.start": "hello" });
  isTrue(
    res14.body.every((d: any) => d.txt.startsWith("hello")),
    'should filter with "like.start"',
  );

  const res15 = await run({ "txt.like.end": "hello" });
  isTrue(
    res15.body.every((d: any) => d.txt.endsWith("hello")),
    'should filter with "like.end"',
  );

  const res16 = await run({ "txt.notLike": "hello" });
  isTrue(
    res16.body.every((d: any) => !d.txt.includes("hello")),
    'should filter with "like"',
  );

  const res17 = await run({ "txt.notLike.start": "hello" });
  isTrue(
    res17.body.every((d: any) => !d.txt.startsWith("hello")),
    'should filter with "like.start"',
  );

  const res18 = await run({ "txt.notLike.end": "hello" });
  isTrue(
    res18.body.every((d: any) => !d.txt.endsWith("hello")),
    'should filter with "like.end"',
  );
});
