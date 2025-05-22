import type React from "react"
import { useState } from "react"
import { Link } from "react-router-dom"
import AuthLayout from "../../components/sesion/login/AuthLayout"
import FormInput from "../../components/sesion/login/FormInput"

const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))
    // Clear error when user types
    if (errors[id as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [id]: "",
      }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Simple validation
    const newErrors = {
      name: !formData.name ? "El nombre es requerido" : "",
      email: !formData.email ? "El correo electrónico es requerido" : "",
      password: !formData.password
        ? "La contraseña es requerida"
        : formData.password.length < 8
          ? "La contraseña debe tener al menos 8 caracteres"
          : "",
      confirmPassword: !formData.confirmPassword
        ? "Confirma tu contraseña"
        : formData.password !== formData.confirmPassword
          ? "Las contraseñas no coinciden"
          : "",
    }

    setErrors(newErrors)

    // Check if there are any errors
    const hasErrors = Object.values(newErrors).some((error) => error !== "")

    // If no errors, proceed with signup
    if (!hasErrors) {
      console.log("Signup with:", formData)
      // Add your signup logic here
    }
  }

  return (
    <AuthLayout title="Crear Cuenta" subtitle="Completa el formulario para registrarte">
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <FormInput
          id="name"
          label="Nombre Completo"
          type="text"
          placeholder="Juan Pérez"
          required
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
        />

        <FormInput
          id="email"
          label="Correo Electrónico"
          type="email"
          placeholder="correo@ejemplo.com"
          required
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
        />

        <FormInput
          id="password"
          label="Contraseña"
          type="password"
          placeholder="••••••••"
          required
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
        />

        <FormInput
          id="confirmPassword"
          label="Confirmar Contraseña"
          type="password"
          placeholder="••••••••"
          required
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
        />

        <div className="flex items-center">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            className="h-4 w-4 text-[#41AD49] focus:ring-[#8DC642] border-gray-300 rounded"
            required
          />
          <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
            Acepto los{" "}
            <button
              type="button"
              onClick={() => alert("Términos y Condiciones")}
              className="text-[#38A2C1] hover:text-[#67DCD7] underline bg-transparent border-none cursor-pointer"
            >
              Términos y Condiciones
            </button>
          </label>
        </div>

        <div>
          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#1C8443] hover:bg-[#41AD49] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8DC642] transition-all"
          >
            Registrarse
          </button>
        </div>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            ¿Ya tienes una cuenta?{" "}
            <Link to="/login" className="font-medium text-[#38A2C1] hover:text-[#67DCD7]">
              Inicia sesión
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  )
}

export default Signup
