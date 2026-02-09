import { useState } from "react";
import api from "../api/axios";
import type { RegisterUser } from "../types/user";

const RegistrationForm = () => {
  const [formData, setFormData] = useState<RegisterUser>({
    name: "",
    email: "",
    password: "",
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

    console.log("User Registration Payload:", formData);

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
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 15000,
      });

      console.log("✅ Server response:", response.data);
      alert("User registered successfully!");
    } catch (error) {
      console.error("❌ Registration failed:", error);
      alert("Registration failed. Check console.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Name" required onChange={handleChange} />
      <input name="email" type="email" placeholder="Email" required onChange={handleChange} />
      <input name="password" type="password" placeholder="Password" required onChange={handleChange} />
      <input name="cv" type="file" onChange={handleChange} />
      <button type="submit">Register</button>
    </form>
  );
};

export default RegistrationForm;