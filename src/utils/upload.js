import axios from 'axios';
import { ipfsApiKey, ipfsPrivateKey, ipfsPostUrl } from '~/config/config';

export const uploadFile = async (file, onError) => {
  const formData = new FormData();
  formData.append('file', file);

  const config = {
    maxContentLength: 'Infinity',
    headers: {
      'Content-Type': `multipart/form-data`,
      pinata_api_key: ipfsApiKey,
      pinata_secret_api_key: ipfsPrivateKey
    }
  };
  try {
    const {
      data: { IpfsHash }
    } = await axios.post(ipfsPostUrl, formData, config);
    return IpfsHash;
  } catch (err) {
    onError({ err });
  }
};
