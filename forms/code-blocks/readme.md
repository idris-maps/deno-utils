## form

```yaml
name: my_form
hide:
  - column: col_string
    value: x
  - column: col_num
    value: 1
submitLabel: Go party
```

```ts
interface FormBlock {
  name: string;
  hide?: { column: string; value: string | boolean | number }[];
  submitLabel?: string;
}
```

## form-update

```yaml
name: my_form
id: row_id
hide:
  - column: col_string
    value: x
  - column: col_num
    value: 1
submitLabel: Go party
```

```ts
interface FormUpdateBlock extends FormBlock {
  id: string;
}
```

## form-table

```yaml
form: my_form
columns:
  - col_string
  - col_num
filters:
  - col_bool = true
  - col_num IN 1,2,3
  - col_date >= 2000-01-01
sort: col_num ASC
limit: 10
offset: 2
```

`filters` must have `<column_name> <operation> <value>` where:

- `<column_name` is the `name` attribute of the column
- `<operation>` is one of: `=`, `!=`, `>`, `>=`, `<`, `<=`, `LIKE`, `NOT LIKE`,
  `IN`, `NOT IN`
- `<value>` is a value for basic operators, contains `%` (`LIKE` & `NOT LIKE`)
  or values separated by `y` (`IN` & `NOT IN`)

`sort` must be `<column_name> <direction>` where:

- `<column_name` is the `name` attribute of the column
- `<direction>` is `ASC` for ascending sorting (leaving it out, sorting will be
  descending)

```ts
interface TableBlock {
  form: string;
  columns?: string[];
  filters?: string[];
  sort?: string;
  limit?: number;
  offset?: number;
}
```
