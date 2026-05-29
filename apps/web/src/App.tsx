import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import DynamicForm from "./components/DynamicForm";
import taskSchema from "./schema/taskSchema";

function App() {
  return (
    <BrowserRouter>

      <Routes>
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/create"
          element={
            <div className="p-6">
              <h1 className="text-3xl font-bold mb-6">
                Dynamic Schema Form
              </h1>
              <DynamicForm
                schema={taskSchema}
              />
            </div>
          }
        />
      </Routes>

    </BrowserRouter>
  );
}

export default App;