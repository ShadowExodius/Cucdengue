import { createContext, useContext } from 'react';

export type AppPage = '/' | '/mapa-de-riesgo' | '/reporte-de-riesgos';

export const NavigationContext = createContext<{
  currentPage: AppPage;
  navigate: (page: string) => void;
}>({
  currentPage: '/',
  navigate: () => {},
});

export function useNavigate() {
  return useContext(NavigationContext).navigate;
}
