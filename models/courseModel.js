  import mongoose from "mongoose";

  const LectureSchema = new mongoose.Schema({
    lectureNumber: { type: Number, required: true },
    title: { type: String, required: true },
    content: { type: String, required: false },
    topics: { type: String, required: true }, // <-- changed here
  });

  const CourseFeatureSchema = new mongoose.Schema({
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    lectures: [LectureSchema],
  });

  const CourseFeature = mongoose.model("CourseFeature", CourseFeatureSchema);
  export default CourseFeature;
