import crypto from "crypto";


export async function encryptAES(key: string, plaintext: string): Promise<string> {
	const cipher = crypto.createCipheriv('aes-256-ecb', Buffer.from(key), Buffer.alloc(0));
	let encryptedText = cipher.update(plaintext, 'utf-8', 'base64');
	encryptedText += cipher.final('base64');
	return encryptedText;
}
export async function decryptAES(key: string, ciphertext: string): Promise<string> {
	const decipher = crypto.createDecipheriv('aes-256-ecb', Buffer.from(key), Buffer.alloc(0));
	let decryptedText = decipher.update(ciphertext, 'base64', 'utf-8');
	decryptedText += decipher.final('utf-8');
	return decryptedText;
}


// export function xorEncrypt(text:string, key:string) {
// 	return text.split('').map(char => String.fromCharCode(char.charCodeAt(0) ^ key)).join('');
// }
