import { h } from "haptic";
import { signal, wire } from "haptic/state";

// @ts-expect-error
// This should be fixed at some point
const Fragment = (...children: unknown[]) => h([], null, ...children);

export type Falsy = false | 0 | "" | null | undefined;

/**
 * If a value is truthy, it will get added to the class names,
 * otherwise the value will be left out
 *
 * ```js
 * cls(['a', false, true && 'b', false && 'c', null,])
 // => "a b"
 * ```
 */
export const cls = (names: (string | Falsy)[]) =>
  names.filter((e) => e).join(" ");

const TestArray = () => <>1{[<div>2</div>, <div>3</div>, <div>4</div>]}5</>;
document.body.append(TestArray());

interface Todo {
  id: number;
  completed: false;
  description: string;
}

const todoList = signal.anon<Todo[]>([]);

let id = 0;
const addTodo = (description: string) =>
  todoList([...todoList(), { id: ++id, description, completed: false }]);

const removeTodo = (id: number) =>
  todoList(todoList().filter((t) => t.id !== id));

let inputRef: HTMLInputElement;

document.body.append(
  <>
    <form
      onSubmit={(event) => {
        event.preventDefault();
        addTodo(inputRef.value);
        inputRef.value = "";
      }}
    >
      {
        (inputRef = (
          <input placeholder="Type a todo here!"></input>
        ) as HTMLInputElement)
      }
    </form>
    <ul>
      {wire(($) =>
        todoList($).map((todo) => (
          <li id={`todo:${todo.id}`}>
            <button onClick={() => removeTodo(todo.id)}>remove</button>
            {todo.description}
          </li>
        ))
      )}
    </ul>
  </>
);
