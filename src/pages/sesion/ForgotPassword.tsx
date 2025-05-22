import type React from "react"
import { useState } from "react"
import { Link } from "react-router-dom"
import AuthLayout from "../../components/sesion/login/AuthLayout"
import FormInput from "../../components/sesion/login/FormInput"

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    if (error) setError("")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Simple validation
    if (!email) {
      setError("El correo electrónico es requerido")
      return
    }

    // If no errors, proceed with password reset
    console.log("Reset password for:", email)
    // Add your password reset logic here

    // Show success message
    setSubmitted(true)
  }

  return (
    <AuthLayout
      title="Recuperar Contraseña"
      subtitle="Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña"
    >
      {!submitted ? (
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <FormInput
            id="email"
            label="Correo Electrónico"
            type="email"
            placeholder="correo@ejemplo.com"
            required
            value={email}
            onChange={handleChange}
            error={error}
          />

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#1C8443] hover:bg-[#41AD49] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8DC642] transition-all"
            >
              Enviar Enlace
            </button>
          </div>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              <Link to="/login" className="font-medium text-[#38A2C1] hover:text-[#67DCD7]">
                Volver al inicio de sesión
              </Link>
            </p>
          </div>
        </form>
      ) : (
        <div className="mt-8 space-y-6">
          <div className="rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-green-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Correo enviado</h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>
                    Hemos enviado un enlace de recuperación a tu correo electrónico. Por favor revisa tu bandeja de
                    entrada.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              <Link to="/login" className="font-medium text-[#38A2C1] hover:text-[#67DCD7]">
                Volver al inicio de sesión
              </Link>
            </p>
          </div>
        </div>
      )}
    </AuthLayout>
  )
}

export default ForgotPassword
