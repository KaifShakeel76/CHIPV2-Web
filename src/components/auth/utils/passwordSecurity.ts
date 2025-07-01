import CryptoJS from 'crypto-js';

// Password security utility for hashing passwords before transmission
class PasswordSecurity {
  // Static salt for consistent hashing (in production, use environment variable)
  private static readonly SALT = import.meta.env.VITE_PASSWORD_SALT || 'chipv2_default_salt_2024';
  
  // Hash password with salt before sending to server
  static hashPassword(password: string): string {
    try {
      // Combine password with salt and hash using SHA-256
      const saltedPassword = password + this.SALT;
      const hashedPassword = CryptoJS.SHA256(saltedPassword).toString();
      
      // Add additional PBKDF2 hashing for extra security
      const finalHash = CryptoJS.PBKDF2(hashedPassword, this.SALT, {
        keySize: 256 / 32,
        iterations: 10000
      }).toString();
      
      return finalHash;
    } catch (error) {
      console.error('Password hashing failed:', error);
      throw new Error('Password hashing failed');
    }
  }
  
  // Validate password format before hashing
  static validatePassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  // Generate secure random salt (for production use)
  static generateSalt(): string {
    return CryptoJS.lib.WordArray.random(256/8).toString();
  }
  
  // Hash password with custom salt (for different users)
  static hashPasswordWithCustomSalt(password: string, customSalt: string): string {
    try {
      const saltedPassword = password + customSalt + this.SALT;
      const hashedPassword = CryptoJS.SHA256(saltedPassword).toString();
      
      const finalHash = CryptoJS.PBKDF2(hashedPassword, customSalt, {
        keySize: 256 / 32,
        iterations: 10000
      }).toString();
      
      return finalHash;
    } catch (error) {
      console.error('Custom password hashing failed:', error);
      throw new Error('Password hashing failed');
    }
  }
}

export default PasswordSecurity;