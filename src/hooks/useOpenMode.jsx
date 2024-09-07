import { useEffect } from "react";
import useLocalStorage from "./useLocalStorage";

const useOpenMode = () => {
  const [SidebarOpened, setSidebarOpened] = useLocalStorage("sidebar", "close");

  return [SidebarOpened, setSidebarOpened];
};

export default useOpenMode;
