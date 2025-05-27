// src/pages/sesion/Login.tsx
import type React from "react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/auth.context"
import AuthLayout from "../../components/sesion/login/AuthLayout"
import FormInput from "../../components/sesion/login/FormInput"

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
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
        general: "",
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Reset errors
    setErrors({
      email: "",
      password: "",
      general: "",
    });

    // Simple validation
    const newErrors = {
      email: !formData.email ? "El correo electrónico es requerido" : "",
      password: !formData.password ? "La contraseña es requerida" : "",
      general: "",
    }

    setErrors(newErrors)

    // If validation errors, return
    if (newErrors.email || newErrors.password) {
      return;
    }

    try {
      await login({
        email: formData.email,
        password: formData.password,
      });
      
      // Redirigir al dashboard después del login exitoso
      navigate('/user/inicio');
    } catch (error: any) {
      console.error('Error en login:', error);
      
      // Manejar diferentes tipos de errores
      if (error.response?.status === 401) {
        setErrors(prev => ({
          ...prev,
          general: "Credenciales incorrectas. Verifica tu email y contraseña."
        }));
      } else if (error.response?.status >= 500) {
        setErrors(prev => ({
          ...prev,
          general: "Error del servidor. Por favor, intenta más tarde."
        }));
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
    <AuthLayout title="Iniciar Sesión" subtitle="Ingresa tus credenciales para acceder a tu cuenta">
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        {errors.general && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
            {errors.general}
          </div>
        )}

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

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-[#41AD49] focus:ring-[#8DC642] border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
              Recordarme
            </label>
          </div>

          <div className="text-sm">
            <Link to="/forgot-password" className="font-medium text-[#38A2C1] hover:text-[#67DCD7]">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
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
                Iniciando sesión...
              </>
            ) : (
              'Iniciar Sesión'
            )}
          </button>
        </div>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            ¿No tienes una cuenta?{" "}
            <Link to="/signup" className="font-medium text-[#38A2C1] hover:text-[#67DCD7]">
              Regístrate
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  )
}

export default Login