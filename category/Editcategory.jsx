import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "../../utils/axios";

const EditCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    Category_Name: "",
    url_Slug: "",
    Icon: "",
    position: "",
    viewonweb: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/v1/categories/${id}`
        );
        const data = await res.json();
        setFormData(data);
      } catch (error) {
        console.error("Error fetching category:", error);
        toast.error("Failed to load category");
      }
    };

    fetchCategory();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await axios.put(`/api/v1/categories/${id}`, formData);

      toast.success("Category updated successfully!");
      navigate("/dashboard/course-categories");
    } catch (error) {
      console.error("Update error:", error);
      const message =
        error?.response?.data?.message || "Error updating category";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-white rounded-lg shadow-lg w-full mx-auto">
      <h2 className="text-2xl font-bold mb-4">Edit Category</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Category Name</label>
          <input
            type="text"
            name="Category_Name"
            value={formData.Category_Name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-gray-700 text-white rounded"
          />
        </div>

        <div>
          <label className="block mb-1">URL Slug</label>
          <input
            type="text"
            name="url_Slug"
            value={formData.url_Slug}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-gray-700 text-white rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Icon (e.g. fa-solid fa-tv)</label>
          <input
            type="text"
            name="Icon"
            value={formData.Icon}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-gray-700 text-white rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Position</label>
          <input
            type="number"
            name="position"
            value={formData.position}
            onChange={(e) => {
              // strip non-numeric chars and limit to 2 digits
              const onlyNums = e.target.value.replace(/\D/g, "").slice(0, 2);
              handleChange({
                target: {
                  name: e.target.name,
                  value: onlyNums,
                },
              });
            }}
            required
            className="w-full px-4 py-2 bg-gray-700 text-white rounded"
            placeholder="Enter position"
          />
        </div>

        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="viewonweb"
              checked={formData.viewonweb}
              onChange={handleChange}
            />
            <span>Show on Website</span>
          </label>
        </div>

        <button
          type="submit"
          className={`w-full px-4 py-2 rounded ${
            isSubmitting ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-500"
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Updating..." : "Update Category"}
        </button>
      </form>
    </div>
  );
};

export default EditCategory;
