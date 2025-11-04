// script/compareImagesNested.js
import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

// ---------- env ----------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("❌ No Mongo URI. Add MONGODB_URI to .env (no spaces).");
  process.exit(1);
}

// adjust if your images live elsewhere
const IMAGES_DIR = "/var/www/Pnywebbackend/uploads/images/courseimages";

// ---------- model ----------
/**
 * You showed:
 *   export default mongoose.model("Course", categoryWithCoursesSchema);
 * so the file is likely models/Course.js
 * If your file name differs, fix the import path below.
 */
import Course from "../models/Course.js";

// ---------- helpers ----------
const toBase = (p) => {
  if (!p) return null;
  try {
    const clean = decodeURIComponent(String(p)).replaceAll("\\", "/").trim();
    return path.basename(clean);
  } catch {
    return path.basename(String(p));
  }
};

// ---------- main ----------
(async function run() {
  await mongoose.connect(MONGO_URI);
  console.log("✅ Mongo connected");

  if (!fs.existsSync(IMAGES_DIR)) {
    console.error("❌ Folder not found:", IMAGES_DIR);
    process.exit(1);
  }

  // files on disk
  const filesOnDisk = fs
    .readdirSync(IMAGES_DIR, { withFileTypes: true })
    .filter((d) => d.isFile())
    .map((d) => d.name);
  const diskSet = new Set(filesOnDisk);

  // pull only the nested courses array
  const totalGroups = await Course.countDocuments();
  const groups = await Course.find({}, { courses: 1 }).lean();

  // collect ALL basenames from courses[].course_Image
  const dbNames = [];
  let courseCount = 0;
  for (const g of groups) {
    const arr = Array.isArray(g.courses) ? g.courses : [];
    courseCount += arr.length;
    for (const c of arr) {
      const b = toBase(c?.course_Image);
      if (b) dbNames.push(b);
    }
  }
  const dbSet = new Set(dbNames);

  console.log(`📊 Groups: ${totalGroups} | Courses in groups: ${courseCount}`);
  console.log(`📂 Files on disk: ${filesOnDisk.length}`);
  console.log(`🗃️ DB image refs (unique basenames): ${dbSet.size}`);

  // disk-only (safe-to-delete candidates)
  const unusedOnDisk = filesOnDisk.filter((f) => !dbSet.has(f));
  // db-only (broken references)
  const missingOnDisk = [...dbSet].filter((f) => !diskSet.has(f));

  console.log(
    `\n🧾 Unused on disk (not referenced in DB): ${unusedOnDisk.length}`
  );
  if (unusedOnDisk.length) {
    fs.writeFileSync(
      "unused_course_images.txt",
      unusedOnDisk.join("\n"),
      "utf8"
    );
    console.log("💾 Saved -> unused_course_images.txt");

    console.log("\n🗑️ Unused file list:");
    unusedOnDisk.forEach((f) => console.log(" -", f));
  }

  console.log(
    `\n⚠️ Missing on disk (referenced in DB but file absent): ${missingOnDisk.length}`
  );
  if (missingOnDisk.length) {
    fs.writeFileSync("missing_on_disk.txt", missingOnDisk.join("\n"), "utf8");
    console.log("💾 Saved -> missing_on_disk.txt");
  }

  // quick sample for sanity
  const sample = dbNames.slice(0, 10);
  console.log("\n🧪 Sample DB basenames:", sample.length ? sample : "(none)");

  await mongoose.disconnect();
})().catch(async (err) => {
  console.error("❌ Error:", err);
  try {
    await mongoose.disconnect();
  } catch {}
  process.exit(1);
});
