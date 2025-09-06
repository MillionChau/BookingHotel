import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.min.css";
import { Routes, Route } from "react-router-dom";
import Loading from "./component/Loading/Loading";
import { Suspense } from "react";
import routes from "./routes/routes";
function App() {
  return (
    <div className="App">
      <Suspense fallback={<Loading />}>
        <Routes>
          {routes.map((item) => {
            const { path, component: Component, layout: Layout } = item;
            if (Layout) {
              return (
                <Route key={path} element={<Layout />}>
                  <Route path={path} element={<Component />} />
                </Route>
              );
            } else {
              return <Route key={path} path={path} element={<Component />} />;
            }
          })}
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
