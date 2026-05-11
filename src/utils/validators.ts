export const rules = {
    required: (value: unknown) => !!value || 'This field is required',

    email: (value: string) => 
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || 'Invalid email address',
      
    minLength: (min: number) => (value: string) => 
        value.length >= min || `Minimum ${min} characters`,

    maxLength: (max: number) => (value: string) => 
        value.length <= max || `Maximum ${max} characters`,

    passwordMatch: (password: string) => (value: string) => 
        value === password || 'The passwords do not match',

    passwordMinLength: (min: number) => (value: string) => 
        value.length >= min || `Minimum ${min} characters`,

    passwordMaxLength: (max: number) => (value: string) => 
        value.length <= max || `Maximum ${max} characters`,

    passwordStrength: (value: string) => 
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value) || 'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character',
}