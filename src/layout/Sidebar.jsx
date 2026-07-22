import { NavLink } from "react-router-dom";
import { FaHome, FaFileSignature, FaSearch, FaCube } from "react-icons/fa";

const Sidebar = () => {
  const baseStyle =
    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all";

  return (
    <div className="w-64 bg-white border-r shadow-sm min-h-screen p-6">
      <nav className="flex flex-col gap-4 text-slate-700 font-medium">

        <NavLink
          to="/"
          className={({ isActive }) =>
            `${baseStyle} ${isActive ? "bg-indigo-100 text-indigo-700" : "hover:bg-slate-100"}`
          }
        >
          <FaHome /> Dashboard
        </NavLink>

        <NavLink
          to="/issue"
          className={({ isActive }) =>
            `${baseStyle} ${isActive ? "bg-indigo-100 text-indigo-700" : "hover:bg-slate-100"}`
          }
        >
          <FaFileSignature /> Issue Certificate
        </NavLink>

        <NavLink
          to="/verify"
          className={({ isActive }) =>
            `${baseStyle} ${isActive ? "bg-indigo-100 text-indigo-700" : "hover:bg-slate-100"}`
          }
        >
          <FaSearch /> Verify Certificate
        </NavLink>

        <NavLink
          to="/explorer"
          className={({ isActive }) =>
            `${baseStyle} ${isActive ? "bg-indigo-100 text-indigo-700" : "hover:bg-slate-100"}`
          }
        >
          <FaCube /> Blockchain Explorer
        </NavLink>

      </nav>
    </div>
  );
};

export default Sidebar;