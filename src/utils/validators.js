export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export const validatePhone = (phone) => {
  const re = /^(09|\+639)\d{9}$/
  return re.test(phone.replace(/[-\s]/g, ''))
}

export const validatePassword = (password) => {
  return password && password.length >= 6
}

export const validateRequired = (value) => {
  return value !== null && value !== undefined && String(value).trim().length > 0
}

export const validateName = (name) => {
  return name && name.trim().length >= 2
}

export const loginValidator = (values) => {
  const errors = {}
  if (!validateEmail(values.email)) errors.email = 'Valid email is required'
  if (!validatePassword(values.password)) errors.password = 'Password must be at least 6 characters'
  return errors
}

export const registerValidator = (values) => {
  const errors = {}
  if (!validateName(values.name)) errors.name = 'Full name is required (min 2 characters)'
  if (!validateEmail(values.email)) errors.email = 'Valid email is required'
  if (!validatePhone(values.phone)) errors.phone = 'Valid PH phone number is required (e.g. 09171234567)'
  if (!validatePassword(values.password)) errors.password = 'Password must be at least 6 characters'
  if (values.password !== values.confirmPassword) errors.confirmPassword = 'Passwords do not match'
  return errors
}

export const hasErrors = (errors) => Object.keys(errors).length > 0
