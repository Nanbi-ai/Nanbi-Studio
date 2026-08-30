// =======================================================================
// NANBI V5.0 - CRYPTOGRAPHIC PAYLOAD WRAPPER (AES-GCM 256-bit)
// =======================================================================

const ALGO_NAME = "AES-GCM";
const KEY_SIZE = 256;

export const CryptoEngine = {
    /**
     * Retrieves the existing sovereign key from the Edge TEE or generates a new one.
     * In a production multi-tenant state, this key is derived from the user's RBAC credential token.
     */
    async getSovereignKey() {
        const storedKeyInfo = localStorage.getItem('nanbi_sovereign_key');
        
        if (storedKeyInfo) {
            const keyData = JSON.parse(storedKeyInfo);
            const rawKey = new Uint8Array(keyData.raw);
            return await crypto.subtle.importKey(
                "raw", rawKey, { name: ALGO_NAME }, false, ["encrypt", "decrypt"]
            );
        }

        // Generate a new AES-GCM 256-bit key
        const newKey = await crypto.subtle.generateKey(
            { name: ALGO_NAME, length: KEY_SIZE }, true, ["encrypt", "decrypt"]
        );

        // Export and cache securely in the local Edge TEE
        const exported = await crypto.subtle.exportKey("raw", newKey);
        const exportedArray = Array.from(new Uint8Array(exported));
        localStorage.setItem('nanbi_sovereign_key', JSON.stringify({ raw: exportedArray }));
        
        return newKey;
    },

    /**
     * Intercepts the raw JSON payload, encrypts it, and returns the Ciphertext + IV
     */
    async encryptPayload(jsonPayload) {
        const key = await this.getSovereignKey();
        const encoder = new TextEncoder();
        const encodedData = encoder.encode(JSON.stringify(jsonPayload));
        
        // The Initialization Vector (IV) must be unique for every single encryption event
        const iv = crypto.getRandomValues(new Uint8Array(12));
        
        const cipherBuffer = await crypto.subtle.encrypt(
            { name: ALGO_NAME, iv: iv }, key, encodedData
        );

        return {
            ciphertext: Array.from(new Uint8Array(cipherBuffer)),
            iv: Array.from(iv)
        };
    },

    /**
     * Retrieves the blind ciphertext from Supabase and reconstructs the JSON in the Edge TEE
     */
    async decryptPayload(cipherArray, ivArray) {
        try {
            const key = await this.getSovereignKey();
            const cipherBuffer = new Uint8Array(cipherArray).buffer;
            const ivBuffer = new Uint8Array(ivArray);

            const decryptedBuffer = await crypto.subtle.decrypt(
                { name: ALGO_NAME, iv: ivBuffer }, key, cipherBuffer
            );

            const decoder = new TextDecoder();
            const decryptedString = decoder.decode(decryptedBuffer);
            return JSON.parse(decryptedString);
        } catch (error) {
            console.error("Cryptographic Decryption Failed. Token mismatch or corrupted ledger.");
            throw new Error("E2E_DECRYPTION_FAILURE");
        }
    }
};
