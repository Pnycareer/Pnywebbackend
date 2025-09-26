import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import useCategories from "../../hooks/useCategories";

const CategoryTable = () => {
  const { categories = [], loading, deleteCategory } = useCategories();
  const [search, setSearch] = useState("");

  // normalize once
  const q = search.trim().toLowerCase();

  // sort + filter (memoized)
  const filtered = useMemo(() => {
    const sorted = [...categories].sort(
      (a, b) => Number(a?.position ?? 0) - Number(b?.position ?? 0)
    );
    if (!q) return sorted;

    return sorted.filter((cat) => {
      const name = (cat?.Category_Name || "").toLowerCase();
      const slug = (cat?.url_Slug || "").toLowerCase();
      const icon = (cat?.Icon || "").toLowerCase();
      return name.includes(q) || slug.includes(q) || icon.includes(q);
    });
  }, [categories, q]);

  return (
    <div className="p-6 bg-gray-900 text-white rounded-lg shadow-lg w-full">
      {/* top bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-4">
        <h2 className="text-2xl font-bold flex-1">All Categories</h2>

        {/* search input */}
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, slug, or icon…"
            className="w-full rounded-md bg-gray-800 border border-gray-700 px-3 py-2 pr-20 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {search ? (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white text-sm"
            >
              Clear
            </button>
          ) : null}
        </div>

        <Link
          to="/dashboard/add-categories"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-center"
        >
          Add Category
        </Link>
      </div>

      {/* table / loading / empty states */}
      {loading ? (
        <p className="text-center py-4">Loading...</p>
      ) : (
        <table className="w-full table-auto border border-gray-700 text-left">
          <thead className="bg-gray-700 text-white">
            <tr>
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Slug</th>
              <th className="px-4 py-2">Icon</th>
              <th className="px-4 py-2">Position</th>
              <th className="px-4 py-2">View</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((cat, i) => (
              <tr key={cat._id} className="border-t border-gray-600">
                <td className="px-4 py-2">{i + 1}</td>
                <td className="px-4 py-2">{cat.Category_Name}</td>
                <td className="px-4 py-2">{cat.url_Slug}</td>
                <td className="px-4 py-2">
                  <i className={cat.Icon}></i>
                </td>
                <td className="px-4 py-2">{cat.position}</td>
                <td className="px-4 py-2">{cat.viewonweb ? "Yes" : "No"}</td>
                <td className="px-4 py-2 space-x-2">
                  <Link
                    to={`/dashboard/edit-category/${cat._id}`}
                    className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded text-white"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteCategory(cat._id)}
                    className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-white"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {!filtered.length && (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-300">
                  {q ? "No categories match your search." : "No categories found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CategoryTable;
