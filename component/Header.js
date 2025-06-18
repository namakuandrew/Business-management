import { MenuIcon } from "./icon";

export default function Header({ setSidebarOpen }) {
  return (
    <header className="flex justify-between items-center mb-8 p-6 md:p-10 pt-6 md:pt-10">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Dashboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Overview of your financial data.
        </p>
      </div>
      <div className="flex items-center">
        <button
          onClick={() => setSidebarOpen((prev) => !prev)}
          className="md:hidden p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 mr-4"
        >
          <MenuIcon />
        </button>
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-500">
          A
        </div>
      </div>
    </header>
  );
}
