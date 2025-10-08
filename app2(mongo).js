import express from "express";
import mongoose from "mongoose";

const app = express();
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/studentdb")
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.log("❌ Connection failed:", err));

const studentSchema = new mongoose.Schema({
  name: String,
  age: Number,
  course: String
});
const Student = mongoose.model("Student", studentSchema);

app.post("/students", async (req, res) => {
  try {
    const student = new Student(req.body);
    const saved = await student.save();
    res.json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/students", async (req, res) => {
  const students = await Student.find();
  res.json(students);
});

app.put("/students/:id", async (req, res) => {
  try {
    const updated = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete("/students/:id", async (req, res) => {
  try {
    const deleted = await Student.findByIdAndDelete(req.params.id);
    res.json({ message: "Student deleted", deleted });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(3000, () => console.log("🚀 Server running on http://localhost:3000"));
