/**
 * Reactアプリケーションのメインエントリーポイント。
 * ここでアプリケーションのルート要素がレンダリングされます。
 */
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// "root"というIDを持つDOM要素を取得し、その中にAppコンポーネントをレンダリングします。
// "!" は non-null assertion operator で、document.getElementById("root") が null でないことをコンパイラに伝えます。
createRoot(document.getElementById("root")!).render(<App />);