import Category from "../models/Category.js";


// Get All Categories with Courses & Instructors
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find()
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: "Server Error", details: error.message });
  }
};

// Create Category
export const createCategory = async (req, res) => {
  try {
    const newCategory = new Category(req.body);
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(400).json({ error: "Bad Request", details: error.message });
  }
};

// Get Single Category by ID
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ error: "Category Not Found" });
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: "Server Error", details: error.message });
  }
};

// Update Category
export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(category);
  } catch (error) {
    res.status(400).json({ error: "Bad Request", details: error.message });
  }
};

// Delete Category
export const deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "Category Deleted" });
  } catch (error) {
    res.status(500).json({ error: "Server Error", details: error.message });
  }
};


export const getCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const category = await Category.findOne({ url_Slug: slug })
      .populate({
        path: 'courses',
        select: 'course_Name url_Slug course_image monthly_tution_fee teacher', // Select required fields
        model: 'Course'
      })
      .populate({
        path: 'instructors',
        select: 'name photo other_info', // Select required fields
        model: 'Instructor'
      });

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Transform the category object to match the desired output
    const transformedCategory = {
      _id: category._id,
      id: category._id.toString(), // Use _id as id
      name: category.Category_Name,
      url_slug: category.url_Slug,
      description_short: category.short_Description,
      description: category.description,
      category_image: category.category_image,
      meta_title: category.meta_Title,
      meta_description: category.meta_Description,
      meta_keywords: category.meta_keywords,
      category_courses: category.courses.map(course => ({
        id: course._id.toString(),
        name: course.course_Name,
        course_image: course.course_image,
        monthly_tution_fee: course.monthly_tution_fee,
        url_slug: course.url_Slug,
        teacher: course.teacher
      })),
      category_instructors: category.instructors.map(instructor => ({
        id: instructor._id.toString(),
        name: instructor.name,
        photo: instructor.photo,
        other_info: instructor.other_info
      })),
      __v: category.__v
    };

    res.status(200).json([transformedCategory]); // Wrap in array to match desired output
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};