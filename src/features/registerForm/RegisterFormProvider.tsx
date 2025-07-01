import { createContext, useContext } from "react"
import { useForm, FormProvider, UseFormReturn } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { RegisterFormSchema, RegisterFormValues } from "./schema"

const RegisterFormContext = createContext<UseFormReturn<RegisterFormValues> | null>(null)

export function useRegisterForm() {
  const context = useContext(RegisterFormContext)
  if (!context) {
    throw new Error("useRegisterForm must be used within RegisterFormProvider")
  }
  return context
}

export function RegisterFormProvider({ children }: { children: React.ReactNode }) {
  const methods = useForm<RegisterFormValues>({
    resolver: zodResolver(RegisterFormSchema),
    mode: "onChange",
  })

  return (
    <RegisterFormContext.Provider value={methods}>
      <FormProvider {...methods}>{children}</FormProvider>
    </RegisterFormContext.Provider>
  )
}
