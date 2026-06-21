import QRCode from 'qrcode';

export const generateQRCodeDataUrl = async (text) => {
  try {
    return await QRCode.toDataURL(text);
  } catch (error) {
    console.error('Failed to generate QR code:', error);
    throw error;
  }
};
