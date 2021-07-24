import { h } from "haptic";
import { Signal, signal, SubToken, transaction, wire } from "haptic/state";

let idCounter = 1;
const adjectives = [
    "pretty",
    "large",
    "big",
    "small",
    "tall",
    "short",
    "long",
    "handsome",
    "plain",
    "quaint",
    "clean",
    "elegant",
    "easy",
    "angry",
    "crazy",
    "helpful",
    "mushy",
    "odd",
    "unsightly",
    "adorable",
    "important",
    "inexpensive",
    "cheap",
    "expensive",
    "fancy",
  ],
  colours = [
    "red",
    "yellow",
    "blue",
    "green",
    "pink",
    "brown",
    "purple",
    "brown",
    "white",
    "black",
    "orange",
  ],
  nouns = [
    "table",
    "chair",
    "house",
    "bbq",
    "desk",
    "car",
    "pony",
    "cookie",
    "sandwich",
    "burger",
    "pizza",
    "mouse",
    "keyboard",
  ];

function random(max: number) {
  return Math.round(Math.random() * 1000) % max;
}

function buildData(count: number): Data[] {
  let data = new Array(count);
  for (let i = 0; i < count; i++) {
    data[i] = {
      id: idCounter++,
      label: signal.anon(
        `${adjectives[random(adjectives.length)]} ${
          colours[random(colours.length)]
        } ${nouns[random(nouns.length)]}`
      ),
    };
  }
  return data;
}

interface ButtonProps {
  id: string;
  text: string;
  fn: () => unknown;
}
const Button = ({ id, text, fn }: ButtonProps) => (
  <div class="col-sm-6 smallpad">
    <button
      id={id}
      class="btn btn-primary btn-block"
      type="button"
      onClick={fn}
    >
      {text}
    </button>
  </div>
);

interface Data {
  id: number;
  label: Signal<string>;
}

export const App = () => {
  const data = signal.anon<Data[]>([]),
    selected = signal.anon<number[]>([]),
    run = () => data(buildData(1000)),
    runLots = () => data(buildData(10000)),
    add = () => {
      data().concat(buildData(1000));
      data(data());
    },
    update = () =>
      transaction(() => {
        for (let i = 0, d = data(), len = d.length; i < len; i += 10)
          d[i]!.label(d[i]!.label() + " !!!");
      }),
    swapRows = () => {
      const d = data().slice();
      if (d.length > 998) {
        let tmp = d[1];
        d[1] = d[998];
        d[998] = tmp;
        data(d);
      }
    },
    clear = () => data([]),
    remove = (id: number) => {
      const d = data();
      const idx = d.findIndex((d) => d.id === id);
      data([...d.slice(0, idx), ...d.slice(idx + 1)]);
    },
    isSelected = ($: SubToken, id: number) => selected($).includes(id),
    setSelected = (id: number) => {
      selected().push(id);
      selected(selected());
    };

  return (
    <div class="container">
      <div class="jumbotron">
        <div class="row">
          <div class="col-md-6">
            <h1>Haptic Keyed (?)</h1>
          </div>
          <div class="col-md-6">
            <div class="row">
              <Button id="run" text="Create 1,000 rows" fn={run} />
              <Button id="runlots" text="Create 10,000 rows" fn={runLots} />
              <Button id="add" text="Append 1,000 rows" fn={add} />
              <Button id="update" text="Update every 10th row" fn={update} />
              <Button id="clear" text="Clear" fn={clear} />
              <Button id="swaprows" text="Swap Rows" fn={swapRows} />
            </div>
          </div>
        </div>
      </div>
      <table class="table table-hover table-striped test-data">
        <tbody>
          {wire(($) =>
            data($).map((row) => {
              let rowId = row.id;
              return (
                <tr class={wire($ => isSelected($, rowId) ? "danger" : "" as string)}>
                  <td class="col-md-1">{rowId}</td>
                  <td class="col-md-4">
                    <a class="lbl" onClick={() => setSelected(rowId)}>{wire(row.label)}</a>
                  </td>
                  <td class="col-md-1">
                    <a class="remove" onClick={() => remove(rowId) }>
                      <span
                        class="glyphicon glyphicon-remove"
                        aria-hidden="true"
                      />
                    </a>
                  </td>
                  <td class="col-md-6" />
                </tr>
              );
            })
          )}
        </tbody>
      </table>
      <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true" />
    </div>
  );
};
