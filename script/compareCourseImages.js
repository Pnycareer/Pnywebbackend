// compareCourseImages.js
import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";
import AcademiaCourse from "../models/Course.js"; // <- your model path
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// load .env from backend root
dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
if (!uri || typeof uri !== "string") {
  console.error("❌ No Mongo URI. Set MONGODB_URI in .env (no spaces).");
  process.exit(1);
}

await mongoose.connect(uri);
console.log("✅ Mongo connected");

const IMAGES_DIR = "/var/www/Pnywebbackend/uploads/images/courseimages";

async function run() {
  const filesOnDisk = fs.readdirSync(IMAGES_DIR).filter(f => !f.startsWith(".")); // skip dotfiles

  // pull image field from DB
  const rows = await AcademiaCourse.find({}, { course_Image: 1 }).lean();
  const dbImageNames = rows
    .map(r => r.course_Image)
    .filter(Boolean)
    .map(p => path.basename(String(p)));

  console.log(`📂 on disk: ${filesOnDisk.length}  |  🗃️ in DB: ${dbImageNames.length}`);

  const dbSet = new Set(dbImageNames);
  const unused = filesOnDisk.filter(f => !dbSet.has(f));

  console.log(`🧾 Unused images: ${unused.length}`);
  unused.forEach(f => console.log(" -", f));

  fs.writeFileSync("unused_course_images.txt", unused.join("\n"), "utf8");
  console.log("💾 Saved list -> unused_course_images.txt");

  await mongoose.disconnect();
}

run().catch(async (err) => {
  console.error("❌ Error:", err);
  try { await mongoose.disconnect(); } catch {}
  process.exit(1);
});
