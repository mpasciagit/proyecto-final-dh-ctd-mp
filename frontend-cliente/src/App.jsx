
import Router from "./components/Router";
import ErrorBoundary from "./components/ErrorBoundary";
import { CalendarModalProvider } from "./context/CalendarModalContext";
import CalendarModalGlobal from "./components/CalendarModalGlobal";

export default function App() {
  return (
    <ErrorBoundary>
      <CalendarModalProvider>
        <Router />
        <CalendarModalGlobal />
      </CalendarModalProvider>
    </ErrorBoundary>
  );
}
