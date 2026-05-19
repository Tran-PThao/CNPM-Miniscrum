import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Đăng nhập thất bại");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setMessage("Đăng nhập thành công");
      navigate("/dashboard");
    } catch (err) {
      setMessage("Không thể kết nối server");
    }
  };

  return (
    <div style={{ padding: 30 }}>
      <h2>Đăng nhập</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Nhập email"
          value={form.email}
          onChange={handleChange}
          style={{ display: "block", marginBottom: 10, padding: 8, width: 300 }}
        />
        <input
          type="password"
          name="password"
          placeholder="Nhập mật khẩu"
          value={form.password}
          onChange={handleChange}
          style={{ display: "block", marginBottom: 10, padding: 8, width: 300 }}
        />
        <button type="submit">Đăng nhập</button>
      </form>

      {message && <p>{message}</p>}

      <p>
        Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
      </p>
    </div>
  );
}

export default Login;
