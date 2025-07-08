import CryptoJS from 'crypto-js';

// Password security utility for encrypting passwords before transmission
class PasswordSecurity {
  // Rails secret key base equivalent - should match backend
  private static readonly SECRET_KEY_BASE = import.meta.env.VITE_SECRET_KEY_BASE || 'chipv2_dev_secret_key_base_2024_secure_development';
  
  // Generate 32-byte encryption key (same as Rails backend)
  private static getEncryptionKey(): CryptoJS.lib.WordArray {
    return CryptoJS.SHA256(this.SECRET_KEY_BASE).clone();
  }
  
  // Encrypt password using AES-256-CBC (matches Rails backend)
  static hashPassword(password: string): string {
    try {
      if (!password) {
        return password;
      }
      
      // Check if encryption is enabled (defaults to true)
      const encryptionEnabled = import.meta.env.VITE_ENCRYPTION_ENABLED !== 'false';
      if (!encryptionEnabled) {
        return password;
      }
      
      // Generate random IV (16 bytes)
      const iv = CryptoJS.lib.WordArray.random(16);
      
      // Get encryption key (32 bytes)
      const key = this.getEncryptionKey();
      
      // Encrypt using AES-256-CBC
      const encrypted = CryptoJS.AES.encrypt(password, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });
      
      // Combine IV + encrypted data
      const combined = iv.concat(encrypted.ciphertext);
      
      // Base64 encode the result
      return CryptoJS.enc.Base64.stringify(combined);
    } catch (error) {
      console.error('Password encryption failed:', error);
      throw new Error('Password encryption failed');
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
  
  // Generate secure random IV (for encryption)
  static generateRandomIV(): string {
    return CryptoJS.lib.WordArray.random(16).toString();
  }
  
  // Test encryption/decryption (for development/testing)
  static testEncryption(password: string): { encrypted: string; key: string } {
    try {
      const encrypted = this.hashPassword(password);
      const key = this.SECRET_KEY_BASE;
      
      console.log('Test encryption:', { 
        original: password, 
        encrypted, 
        keyBase: key.substring(0, 10) + '...' 
      });
      
      return { encrypted, key };
    } catch (error) {
      console.error('Test encryption failed:', error);
      throw new Error('Test encryption failed');
    }
  }
}

export default PasswordSecurity;