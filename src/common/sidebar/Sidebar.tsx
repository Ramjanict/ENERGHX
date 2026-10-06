import { logout } from "@/store/auth/auth.slice";
import { RootState } from "@/store/store";
import { useEffect, useState } from "react";
import { IconType } from "react-icons";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { LuPanelLeft } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useLocation } from "react-router-dom";

export interface MenuItem {
  path?: string;
  label: string;
  icon: IconType;
  children?: MenuItem[];
}

// Define props type for Sidebar
export interface SidebarProps {
  menuItems: MenuItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ menuItems }) => {
  const { pathname } = useLocation();
  const { token } = useSelector((state: RootState) => state.auth);
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  // Interactive toggle state with localStorage persistence
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    const saved = localStorage.getItem("consumer_sidebar_collapsed");
    if (saved !== null) return saved === "true";
    return typeof window !== "undefined" ? window.innerWidth < 1280 : false;
  });

  const toggleSidebar = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("consumer_sidebar_collapsed", String(next));
      return next;
    });
  };

  const dispatch = useDispatch();

  const isPathActive = (itemPath?: string, navLinkIsActive?: boolean) => {
    if (navLinkIsActive) return true;
    if (!itemPath || itemPath === "#") return false;

    const current = pathname.replace(/\/+$/, "");
    const target = itemPath.replace(/\/+$/, "");

    if (current === target) return true;

    // When redirected to /standard-consumer or /basic-consumer, highlight the corresponding dashboard
    if (target.endsWith("/dashboard")) {
      const parentPath = target.replace(/\/dashboard$/, "");
      if (current === parentPath) return true;
    }

    return false;
  };

  useEffect(() => {
    menuItems.forEach((item) => {
      if (item.children?.some((child) => isPathActive(child.path))) {
        setOpenMenus((prev) => ({ ...prev, [item.label]: true }));
      }
    });
  }, [pathname, menuItems]);

  const handleLogout = () => {
    if (!token) return;
    try {
      dispatch(logout());
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  return (
    <div
      className={`${
        isCollapsed ? "w-16" : "w-72 xl:w-80"
      } shrink-0 min-h-screen text-[#758179] border-r border-t border-r-[#E7E9E8] border-t-[#E7E9E8] border-gray-300 z-10 bg-white transition-all duration-300 ease-in-out`}
    >
      {/* Sidebar Header Toggle */}
      <div
        className={`flex items-center p-3 border-b border-[#E7E9E8] ${
          isCollapsed ? "justify-center" : "justify-between"
        }`}
      >
        {!isCollapsed && (
          <span className="text-xs font-semibold uppercase tracking-wider text-[#758179] px-1 select-none">
            Navigation
          </span>
        )}
        <button
          type="button"
          onClick={toggleSidebar}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="p-1.5 rounded-lg hover:bg-[#EAF7E6] text-[#758179] hover:text-primary transition-colors cursor-pointer flex items-center justify-center"
        >
          <LuPanelLeft size={20} />
        </button>
      </div>

      <ul className="w-full">
        {menuItems.map((item, index) => (
          <div className="w-full" key={index}>
            {item.children ? (
              <>
                <button
                  type="button"
                  title={item.label}
                  onClick={() => {
                    if (isCollapsed) {
                      setIsCollapsed(false);
                      localStorage.setItem("consumer_sidebar_collapsed", "false");
                      setOpenMenus((prev) => ({ ...prev, [item.label]: true }));
                    } else {
                      toggleMenu(item.label);
                    }
                  }}
                  className={`w-full flex items-center p-3 hover:bg-[#EAF7E6] cursor-pointer transition-colors ${
                    isCollapsed ? "justify-center" : "justify-between"
                  }`}
                >
                  <div
                    className={`flex items-center gap-2.5 min-w-0 ${
                      isCollapsed ? "justify-center" : ""
                    }`}
                  >
                    <item.icon size={20} className="shrink-0" />
                    {!isCollapsed && (
                      <span className="whitespace-nowrap font-medium">
                        {item.label}
                      </span>
                    )}
                  </div>
                  {!isCollapsed && (
                    <span className="inline-flex items-center shrink-0 ml-2">
                      {openMenus[item.label] ? (
                        <FaChevronDown size={14} />
                      ) : (
                        <FaChevronRight size={14} />
                      )}
                    </span>
                  )}
                </button>
                {openMenus[item.label] &&
                  item.children.map((child, childIndex) => (
                    <NavLink
                      key={childIndex}
                      to={child.path!}
                      title={child.label}
                      className={({ isActive }) => {
                        const active = isPathActive(child.path, isActive);
                        return `w-full flex items-center gap-2.5 p-3 transition-colors ${
                          isCollapsed ? "justify-center" : "justify-start"
                        } ${
                          active
                            ? "bg-primary text-white font-medium"
                            : "hover:bg-[#EAF7E6]"
                        }`;
                      }}
                    >
                      <child.icon size={18} className="shrink-0" />
                      {!isCollapsed && (
                        <span className="text-sm leading-snug whitespace-nowrap">
                          {child.label}
                        </span>
                      )}
                    </NavLink>
                  ))}
              </>
            ) : (
              <NavLink
                to={item.path!}
                title={item.label}
                onClick={() => {
                  if (item.label === "Logout") {
                    handleLogout();
                  }
                }}
                className={({ isActive }) => {
                  const active = isPathActive(item.path, isActive);
                  return `w-full flex items-center gap-2.5 p-3 transition-colors ${
                    isCollapsed ? "justify-center" : "justify-start"
                  } ${
                    active
                      ? "bg-primary text-white font-medium"
                      : "hover:bg-[#EAF7E6]"
                  }`;
                }}
              >
                <item.icon size={20} className="shrink-0" />
                {!isCollapsed && (
                  <span className="whitespace-nowrap font-medium">
                    {item.label}
                  </span>
                )}
              </NavLink>
            )}
          </div>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
