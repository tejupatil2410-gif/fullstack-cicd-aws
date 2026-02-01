import { useState } from "react";
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // MOCK submit
    console.log("User Registration Payload:", formData);
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