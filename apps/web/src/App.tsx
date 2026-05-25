import DynamicForm from "./components/DynamicForm";
import taskSchema from "./schema/taskSchema";

function App() {
  return (
    <div>
      <h1>Dynamic Schema Form</h1>

      <DynamicForm schema={taskSchema} />
    </div>
  );
}

export default App;