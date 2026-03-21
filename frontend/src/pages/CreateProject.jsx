import { useState } from "react";

function CreateProject() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    goal: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Tạo project thất bại");
        return;
      }

      setMessage(`Tạo project thành công, projectId: ${data.projectId}`);
      setForm({ name: "", description: "", goal: "" });
    } catch (err) {
      setMessage("Không thể kết nối server");
    }
  };

  return (
    <div style={{ padding: 30 }}>
      <h2>Tạo Project</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Tên project"
          value={form.name}
          onChange={handleChange}
          style={{ display: "block", marginBottom: 10, padding: 8, width: 300 }}
        />
        <input
          type="text"
          name="description"
          placeholder="Mô tả"
          value={form.description}
          onChange={handleChange}
          style={{ display: "block", marginBottom: 10, padding: 8, width: 300 }}
        />
        <input
          type="text"
          name="goal"
          placeholder="Mục tiêu"
          value={form.goal}
          onChange={handleChange}
          style={{ display: "block", marginBottom: 10, padding: 8, width: 300 }}
        />
        <button type="submit">Tạo Project</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default CreateProject;
