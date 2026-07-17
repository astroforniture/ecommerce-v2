export function isValidVatNumber(value: string): boolean {
  return /^[A-Za-z]{2}\d{11}$|^\d{11}$/.test(value.trim())
}

export function isValidItalianTaxCode(value: string): boolean {
  return /^[A-Za-z0-9]{11,16}$/i.test(value.trim())
}

/** Codice SDI (7 caratteri) oppure indirizzo PEC. */
export function isValidSdiOrPec(value: string): boolean {
  const v = value.trim()
  if (/^[A-Za-z0-9]{7}$/.test(v)) return true
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
}

export type ElectronicInvoiceFormValues = {
  companyName: string
  vatNumber: string
  taxCode: string
  sdiOrPec: string
}

export function validateElectronicInvoice(
  values: ElectronicInvoiceFormValues,
): {
  companyNameValid: boolean
  vatNumberValid: boolean
  taxCodeValid: boolean
  sdiOrPecValid: boolean
  isValid: boolean
} {
  const companyNameValid = values.companyName.trim().length >= 2
  const vatNumberValid = isValidVatNumber(values.vatNumber)
  const taxCodeValid = isValidItalianTaxCode(values.taxCode)
  const sdiOrPecValid = isValidSdiOrPec(values.sdiOrPec)

  return {
    companyNameValid,
    vatNumberValid,
    taxCodeValid,
    sdiOrPecValid,
    isValid: companyNameValid && vatNumberValid && taxCodeValid && sdiOrPecValid,
  }
}
