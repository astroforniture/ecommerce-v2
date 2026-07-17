import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { Building2, Eye, EyeOff, Mail, Phone, User, UserRound } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { signUpWithEmailPassword } from '../lib/userAuth'

const schema = z
  .object({
    accountType: z.enum(['azienda', 'privato']),
    firstName: z.string().trim().min(2, 'Inserisci il nome'),
    lastName: z.string().trim().min(2, 'Inserisci il cognome'),
    email: z.string().trim().email('Email non valida'),
    phone: z.string().trim().min(6, 'Telefono non valido'),
    password: z.string().min(6, 'Minimo 6 caratteri'),
    confirmPassword: z.string().min(6, 'Conferma la password'),
    companyName: z.string().trim().optional(),
    vatNumber: z.string().trim().optional(),
    taxCode: z.string().trim().optional(),
    sdiCode: z.string().trim().optional(),
    pecEmail: z.string().trim().optional(),
    address: z.string().trim().min(5, 'Inserisci indirizzo e numero civico'),
    city: z.string().trim().min(2, 'Inserisci la citta'),
    zipCode: z
      .string()
      .trim()
      .regex(/^\d{5}$/, 'CAP non valido (5 cifre)'),
    province: z.string().trim().min(2, 'Seleziona la provincia'),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['confirmPassword'],
        message: 'Le password non corrispondono',
      })
    }
    if (data.accountType === 'azienda') {
      if (!data.companyName || data.companyName.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['companyName'],
          message: 'Ragione sociale obbligatoria per account azienda',
        })
      }
      if (!data.vatNumber || data.vatNumber.length < 8) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['vatNumber'],
          message: 'Partita IVA obbligatoria per account azienda',
        })
      }
      const sdi = (data.sdiCode ?? '').trim()
      const pec = (data.pecEmail ?? '').trim()
      if (!sdi && !pec) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['sdiCode'],
          message: 'Per azienda devi compilare almeno Codice SDI o PEC',
        })
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['pecEmail'],
          message: 'Per azienda devi compilare almeno PEC o Codice SDI',
        })
      }
      if (sdi && !/^[A-Za-z0-9]{7}$/.test(sdi)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['sdiCode'],
          message: 'Codice SDI non valido (7 caratteri alfanumerici)',
        })
      }
      if (pec && !z.string().email().safeParse(pec).success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['pecEmail'],
          message: 'PEC non valida',
        })
      }
    } else if (!data.taxCode || data.taxCode.length < 8) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['taxCode'],
        message: 'Codice Fiscale obbligatorio per account privato',
      })
    }
  })

type RegisterForm = z.infer<typeof schema>

const IT_PROVINCES = [
  'AG', 'AL', 'AN', 'AO', 'AP', 'AQ', 'AR', 'AT', 'AV', 'BA', 'BG', 'BI', 'BL', 'BN', 'BO',
  'BR', 'BS', 'BT', 'BZ', 'CA', 'CB', 'CE', 'CH', 'CL', 'CN', 'CO', 'CR', 'CS', 'CT', 'CZ',
  'EN', 'FC', 'FE', 'FG', 'FI', 'FM', 'FR', 'GE', 'GO', 'GR', 'IM', 'IS', 'KR', 'LC', 'LE',
  'LI', 'LO', 'LT', 'LU', 'MB', 'MC', 'ME', 'MI', 'MN', 'MO', 'MS', 'MT', 'NA', 'NO', 'NU',
  'OR', 'PA', 'PC', 'PD', 'PE', 'PG', 'PI', 'PN', 'PO', 'PR', 'PT', 'PU', 'PV', 'PZ', 'RA',
  'RC', 'RE', 'RG', 'RI', 'RM', 'RN', 'RO', 'SA', 'SI', 'SO', 'SP', 'SR', 'SS', 'SU', 'SV',
  'TA', 'TE', 'TN', 'TO', 'TP', 'TR', 'TS', 'TV', 'UD', 'VA', 'VB', 'VC', 'VE', 'VI', 'VR',
  'VT',
] as const

export function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      accountType: 'privato',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      companyName: '',
      vatNumber: '',
      taxCode: '',
      sdiCode: '',
      pecEmail: '',
      address: '',
      city: '',
      zipCode: '',
      province: '',
    },
  })
  const accountType = watch('accountType')

  async function onSubmit(values: RegisterForm) {
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      const res = await signUpWithEmailPassword({
        email: values.email.trim(),
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName,
        phone: values.phone,
        accountType: values.accountType,
        companyName: values.accountType === 'azienda' ? values.companyName : undefined,
        vatNumber: values.accountType === 'azienda' ? values.vatNumber : undefined,
        taxCode: values.taxCode,
        sdiCode: values.accountType === 'azienda' ? values.sdiCode : undefined,
        pecEmail: values.accountType === 'azienda' ? values.pecEmail : undefined,
        address: values.address,
        city: values.city,
        zipCode: values.zipCode,
        province: values.province,
      })
      if (!res.ok) {
        setError(res.error ?? 'Registrazione non riuscita.')
        return
      }
      setSuccess('Registrazione completata. Controlla la tua email per confermare l’account.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-[70vh] bg-slate-50">
      <div className="mx-auto flex max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <Card className="w-full border-slate-200 shadow-sm">
          <div className="h-1.5 rounded-t-xl bg-brand-700" aria-hidden />
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-slate-900">Crea il tuo account</CardTitle>
            <CardDescription>
              Registrazione rapida e sicura per acquistare su Astro Forniture.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <p className="text-xs text-slate-500">*Campi obbligatori</p>

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setValue('accountType', 'azienda', { shouldValidate: true })}
                  className={`w-full rounded-xl border-2 p-5 text-left transition ${
                    accountType === 'azienda'
                      ? 'border-brand-700 bg-brand-50'
                      : 'border-slate-200 bg-white hover:border-brand-200'
                  }`}
                >
                  <Building2 className="mb-2 size-5 text-brand-700" />
                  <p className="font-semibold text-slate-900">Sei un'Azienda</p>
                  <p className="mt-1 text-xs text-slate-600">Acquisto con dati fiscali aziendali.</p>
                </button>
                <button
                  type="button"
                  onClick={() => setValue('accountType', 'privato', { shouldValidate: true })}
                  className={`w-full rounded-xl border-2 p-5 text-left transition ${
                    accountType === 'privato'
                      ? 'border-brand-700 bg-brand-50'
                      : 'border-slate-200 bg-white hover:border-brand-200'
                  }`}
                >
                  <UserRound className="mb-2 size-5 text-brand-700" />
                  <p className="font-semibold text-slate-900">Sei un Privato</p>
                  <p className="mt-1 text-xs text-slate-600">Registrazione personale rapida.</p>
                </button>
              </div>

              <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                <div className="space-y-5 rounded-xl border border-slate-200 bg-white p-6 lg:p-7">
                  <h3 className="text-base font-semibold text-brand-700">Dati Account</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Nome *" error={errors.firstName?.message}>
                    <div className="relative">
                      <User className="pointer-events-none absolute left-3 top-4 size-4 text-slate-400" />
                      <Input
                        className="h-12 rounded-lg border-slate-200 bg-white py-3 pl-9 focus:border-brand-500 focus:ring-brand-500/20"
                        {...register('firstName')}
                      />
                    </div>
                    </Field>
                    <Field label="Cognome *" error={errors.lastName?.message}>
                    <div className="relative">
                      <User className="pointer-events-none absolute left-3 top-4 size-4 text-slate-400" />
                      <Input
                        className="h-12 rounded-lg border-slate-200 bg-white py-3 pl-9 focus:border-brand-500 focus:ring-brand-500/20"
                        {...register('lastName')}
                      />
                    </div>
                    </Field>
                  </div>

                  <Field label="Email *" error={errors.email?.message}>
                    <div className="relative w-full">
                      <Mail className="pointer-events-none absolute left-3 top-4 size-4 text-slate-400" />
                      <Input
                        type="email"
                        className="h-12 w-full rounded-lg border-slate-200 bg-white py-3 pl-9 focus:border-brand-500 focus:ring-brand-500/20"
                        {...register('email')}
                      />
                    </div>
                  </Field>

                  <Field label="Telefono *" error={errors.phone?.message}>
                    <div className="relative">
                    <Phone className="pointer-events-none absolute left-3 top-4 size-4 text-slate-400" />
                    <Input
                      className="h-12 rounded-lg border-slate-200 bg-white py-3 pl-9 focus:border-brand-500 focus:ring-brand-500/20"
                      {...register('phone')}
                    />
                    </div>
                  </Field>

                  <Field label="Password *" error={errors.password?.message}>
                    <div className="relative">
                      <User className="pointer-events-none absolute left-3 top-4 size-4 text-slate-400" />
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        className="h-12 rounded-lg border-slate-200 bg-white py-3 pl-9 pr-10 focus:border-brand-500 focus:ring-brand-500/20"
                        {...register('password')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-4 text-slate-500 hover:text-slate-700"
                        aria-label={showPassword ? 'Nascondi password' : 'Mostra password'}
                      >
                        {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                  </Field>

                  <Field label="Conferma Password *" error={errors.confirmPassword?.message}>
                    <div className="relative">
                      <User className="pointer-events-none absolute left-3 top-4 size-4 text-slate-400" />
                      <Input
                        type={showConfirmPassword ? 'text' : 'password'}
                        className="h-12 rounded-lg border-slate-200 bg-white py-3 pl-9 pr-10 focus:border-brand-500 focus:ring-brand-500/20"
                        {...register('confirmPassword')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((v) => !v)}
                        className="absolute right-3 top-4 text-slate-500 hover:text-slate-700"
                        aria-label={showConfirmPassword ? 'Nascondi conferma password' : 'Mostra conferma password'}
                      >
                        {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                  </Field>
                </div>

                <div className="space-y-6 rounded-xl border border-slate-200 bg-slate-50 p-6 lg:p-8">
                  <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5">
                    <h3 className="text-base font-semibold text-brand-700">Dati fiscali</h3>
                    {accountType === 'azienda' ? (
                      <>
                        <Field label="Ragione sociale *" error={errors.companyName?.message}>
                          <Input className="h-11 rounded-lg py-3" {...register('companyName')} />
                        </Field>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <Field label="Partita IVA *" error={errors.vatNumber?.message}>
                            <Input className="h-11 rounded-lg py-3" {...register('vatNumber')} />
                          </Field>
                          <Field label="Codice Fiscale (facoltativo)" error={errors.taxCode?.message}>
                            <Input className="h-11 rounded-lg py-3" {...register('taxCode')} />
                          </Field>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <Field label="Codice Destinatario (SDI)" error={errors.sdiCode?.message}>
                            <Input
                              className="h-11 rounded-lg py-3"
                              maxLength={7}
                              {...register('sdiCode', {
                                onChange: (e) => {
                                  const clean = String(e.target.value ?? '')
                                    .replace(/[^A-Za-z0-9]/g, '')
                                    .toUpperCase()
                                    .slice(0, 7)
                                  setValue('sdiCode', clean, { shouldValidate: true })
                                },
                              })}
                            />
                          </Field>
                          <Field label="PEC" error={errors.pecEmail?.message}>
                            <Input
                              type="email"
                              className="h-11 rounded-lg py-3"
                              placeholder="fatturazione@pec.azienda.it"
                              {...register('pecEmail')}
                            />
                          </Field>
                        </div>
                      </>
                    ) : (
                      <Field label="Codice Fiscale *" error={errors.taxCode?.message}>
                        <Input className="h-11 rounded-lg py-3" {...register('taxCode')} />
                      </Field>
                    )}
                  </section>

                  <section className="space-y-4">
                    <h3 className="text-base font-semibold text-brand-700">Indirizzo</h3>
                    <Field label="Indirizzo e Numero Civico *" error={errors.address?.message}>
                      <Input className="h-11 rounded-lg bg-white py-3" {...register('address')} />
                    </Field>
                    <Field label="Citta *" error={errors.city?.message}>
                      <Input className="h-11 rounded-lg bg-white py-3" {...register('city')} />
                    </Field>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <Field label="CAP *" error={errors.zipCode?.message}>
                          <Input
                            className="h-11 rounded-lg bg-white py-3"
                            inputMode="numeric"
                            maxLength={5}
                            {...register('zipCode', {
                              onChange: (e) => {
                                const digits = String(e.target.value ?? '')
                                  .replace(/\D/g, '')
                                  .slice(0, 5)
                                setValue('zipCode', digits, { shouldValidate: true })
                              },
                            })}
                          />
                        </Field>
                      </div>
                      <div>
                        <Field label="Provincia *" error={errors.province?.message}>
                          <select
                            className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                            {...register('province')}
                          >
                            <option value="">Seleziona</option>
                            {IT_PROVINCES.map((p) => (
                              <option key={p} value={p}>
                                {p}
                              </option>
                            ))}
                          </select>
                        </Field>
                      </div>
                    </div>
                  </section>
                </div>
              </div>

              {error ? <p className="text-sm font-medium text-red-700">{error}</p> : null}
              {success ? <p className="text-sm font-medium text-emerald-700">{success}</p> : null}

              <Button
                type="submit"
                disabled={loading}
                className="mt-2 w-full rounded-lg bg-red-600 text-white shadow-sm hover:bg-red-700 hover:shadow"
              >
                {loading ? 'Registrazione in corso...' : 'CONFERMA'}
              </Button>

              <p className="text-center text-sm text-slate-600">
                Hai gia un account?{' '}
                <Link to="/login" className="font-semibold text-brand-700 hover:text-brand-900">
                  Vai al login
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      {children}
      {error ? <p className="text-xs text-red-700">{error}</p> : null}
    </div>
  )
}
