import {API_URL_IMG} from '@/utils/config'

const getCorrectImage = (url: string) => {
  return API_URL_IMG + url;
};

export default getCorrectImage;
