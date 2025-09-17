import { Capacitor } from '@capacitor/core';

declare global {
  interface Window {
    PublicKeyCredential?: any;
  }
}

export interface BiometricAuthResult {
  success: boolean;
  error?: string;
  method?: 'webauthn' | 'native' | 'fallback';
}

export class BiometricAuth {
  static async isAvailable(): Promise<boolean> {
    try {
      if (Capacitor.isNativePlatform()) {
        // On native platforms, assume biometric is available
        // This would be enhanced with actual native checks
        return true;
      } else {
        // Check for WebAuthn support in browsers
        return !!(window.PublicKeyCredential && await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable());
      }
    } catch (error) {
      console.error('Error checking biometric availability:', error);
      return false;
    }
  }

  static async authenticate(options: {
    reason: string;
    title: string;
    subtitle?: string;
    description?: string;
  }): Promise<BiometricAuthResult> {
    try {
      if (Capacitor.isNativePlatform()) {
        // On native platforms, use native biometric authentication
        return await this.authenticateNative(options);
      } else {
        // On web, use WebAuthn if available
        return await this.authenticateWebAuthn(options);
      }
    } catch (error) {
      console.error('Biometric authentication error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Authentication failed',
        method: 'fallback'
      };
    }
  }

  private static async authenticateNative(options: any): Promise<BiometricAuthResult> {
    // This is a simulation for native authentication
    // In a real app, this would use Capacitor plugins for native biometric auth
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate native biometric authentication with high success rate
        const success = Math.random() > 0.1; // 90% success rate
        resolve({
          success,
          method: 'native',
          error: success ? undefined : 'Biometric authentication failed'
        });
      }, 1500);
    });
  }

  private static async authenticateWebAuthn(options: any): Promise<BiometricAuthResult> {
    try {
      console.log('🌐 Starting WebAuthn authentication...');
      
      if (!window.PublicKeyCredential) {
        console.log('❌ WebAuthn not supported in this browser');
        throw new Error('WebAuthn not supported');
      }

      // Create a simple WebAuthn challenge for biometric authentication
      const randomBytes = new Uint8Array(32);
      crypto.getRandomValues(randomBytes);
      
      const credential = await navigator.credentials.create({
        publicKey: {
          challenge: randomBytes,
          rp: {
            name: "India Election System",
            id: window.location.hostname.includes('localhost') ? 'localhost' : window.location.hostname,
          },
          user: {
            id: new Uint8Array(16),
            name: "voter",
            displayName: "Election Voter",
          },
          pubKeyCredParams: [{
            type: "public-key",
            alg: -7, // ES256
          }],
          authenticatorSelection: {
            authenticatorAttachment: "platform",
            userVerification: "required",
          },
          timeout: 30000,
        },
      });

      console.log('✅ WebAuthn authentication successful');
      return {
        success: !!credential,
        method: 'webauthn'
      };
    } catch (error) {
      console.error('WebAuthn error:', error);
      return {
        success: false,
        error: 'WebAuthn authentication failed',
        method: 'webauthn'
      };
    }
  }
}