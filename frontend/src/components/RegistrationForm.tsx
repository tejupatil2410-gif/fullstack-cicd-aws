import { useRef, useState } from "react";
import api from "../api/axios";
import type { RegisterUser } from "../types/user";

const RegistrationForm = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [formData, setFormData] = useState<RegisterUser>({
    name: "",
    email: "",
    password: "",
    cv: undefined,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("password", formData.password);

    if (formData.cv) {
      data.append("cv", formData.cv);
    }

    try {
      console.log("🚀 Sending API request...");

      const response = await api.post("/api/register", data, {
        timeout: 20000,
        // ❌ DO NOT set Content-Type
      });

      console.log("✅ Server response:", response.data);
      alert("User registered successfully!");

      // ✅ RESET FORM STATE
      setFormData({
        name: "",
        email: "",
        password: "",
        cv: undefined,
      });

      // ✅ RESET FILE INPUT (CRITICAL)
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

    } catch (error) {
      console.error("❌ Registration failed:", error);
      alert("Registration failed. Check console.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        placeholder="Name"
        required
        value={formData.name}
        onChange={handleChange}
      />

      <input
        name="email"
        type="email"
        placeholder="Email"
        required
        value={formData.email}
        onChange={handleChange}
      />

      <input
        name="password"
        type="password"
        placeholder="Password"
        required
        value={formData.password}
        onChange={handleChange}
      />

      <input
        name="cv"
        type="file"
        ref={fileInputRef}
        onChange={handleChange}
        required
      />

      <button type="submit">Register</button>
    </form>
  );
};

export default RegistrationForm;