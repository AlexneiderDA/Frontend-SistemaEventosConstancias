// src/pages/sesion/Signup.tsx
import type React from "react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/auth.context"
import AuthLayout from "../../components/sesion/login/AuthLayout"
import FormInput from "../../components/sesion/login/FormInput"

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { signup, isLoading } = useAuth();
  
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
    general: "",
  })

  const [acceptTerms, setAcceptTerms] = useState(false);

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
        general: "",
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {
      name: !formData.name.trim() ? "El nombre es requerido" : 
            formData.name.trim().length < 2 ? "El nombre debe tener al menos 2 caracteres" : "",
      email: !formData.email ? "El correo electrónico es requerido" : 
             !/\S+@\S+\.\S+/.test(formData.email) ? "El correo electrónico no es válido" : "",
      password: !formData.password ? "La contraseña es requerida" : 
                formData.password.length < 8 ? "La contraseña debe tener al menos 8 caracteres" :
                !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(formData.password) ? 
                "La contraseña debe contener al menos una letra minúscula, una mayúscula y un número" : "",
      confirmPassword: !formData.confirmPassword ? "Confirma tu contraseña" : 
                       formData.password !== formData.confirmPassword ? "Las contraseñas no coinciden" : "",
      general: "",
    }

    return newErrors;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Reset errors
    setErrors({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      general: "",
    });

    // Validate form
    const newErrors = validateForm();
    setErrors(newErrors)

    // Check if there are any errors
    const hasErrors = Object.values(newErrors).some((error) => error !== "")

    // Check terms acceptance
    if (!acceptTerms) {
      setErrors(prev => ({
        ...prev,
        general: "Debes aceptar los términos y condiciones para continuar."
      }));
      return;
    }

    // If validation errors, return
    if (hasErrors) {
      return;
    }

    try {
      await signup({
        name: formData.name.trim(),
        email: formData.email,
        password: formData.password,
        passwordConfirm: formData.confirmPassword,
      });
      
      // Redirigir al dashboard después del registro exitoso
      navigate('/user/inicio');
    } catch (error: any) {
      console.error('Error en signup:', error);
      
      // Manejar diferentes tipos de errores
      if (error.response?.status === 409) {
        setErrors(prev => ({
          ...prev,
          email: "Este correo electrónico ya está registrado.",
          general: ""
        }));
      } else if (error.response?.status >= 500) {
        setErrors(prev => ({
          ...prev,
          general: "Error del servidor. Por favor, intenta más tarde."
        }));
      } else if (error.response?.data?.details) {
        // Manejar errores de validación del servidor
        const serverErrors = error.response.data.details;
        const newErrors = { ...errors };
        
        serverErrors.forEach((err: any) => {
          if (err.path === 'name') newErrors.name = err.message;
          else if (err.path === 'email') newErrors.email = err.message;
          else if (err.path === 'password') newErrors.password = err.message;
          else if (err.path === 'passwordConfirm') newErrors.confirmPassword = err.message;
        });
        
        setErrors(newErrors);
      } else if (error.response?.data?.error) {
        setErrors(prev => ({
          ...prev,
          general: error.response.data.error
        }));
      } else {
        setErrors(prev => ({
          ...prev,
          general: "Ocurrió un error inesperado. Por favor, intenta más tarde."
        }));
      }
    }
  }

  return (
    <AuthLayout title="Crear Cuenta" subtitle="Completa el formulario para registrarte">
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        {errors.general && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
            {errors.general}
          </div>
        )}

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
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
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
            disabled={isLoading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#1C8443] hover:bg-[#41AD49] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8DC642] transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                Registrando...
              </>
            ) : (
              'Registrarse'
            )}
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