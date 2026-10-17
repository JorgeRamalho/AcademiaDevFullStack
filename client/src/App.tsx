import { BrowserRouter, HashRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./auth";
import { Layout } from "./components/Layout";
import { DataPage } from "./pages/DataPage";
import { DocumentationPage } from "./pages/DocumentationPage";
import { ExercisePage } from "./pages/ExercisePage";
import { ExercisesPage } from "./pages/ExercisesPage";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { MapPage } from "./pages/MapPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ProfilePage } from "./pages/ProfilePage";
import { RegisterPage } from "./pages/RegisterPage";
import { StudyRoomPage } from "./pages/StudyRoomPage";
import { TrackPage } from "./pages/TrackPage";
import { TracksPage } from "./pages/TracksPage";

const Router = import.meta.env.PROD ? HashRouter : BrowserRouter;

export function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="trilhas" element={<TracksPage />} />
            <Route path="trilhas/:slug" element={<TrackPage />} />
            <Route path="exercicios" element={<ExercisesPage />} />
            <Route path="exercicios/:slug" element={<ExercisePage />} />
            <Route path="sala" element={<StudyRoomPage />} />
            <Route path="cadastro" element={<RegisterPage />} />
            <Route path="entrar" element={<LoginPage />} />
            <Route path="eu" element={<ProfilePage />} />
            <Route path="mapa" element={<MapPage />} />
            <Route path="documentacao" element={<DocumentationPage />} />
            <Route path="dados" element={<DataPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}
