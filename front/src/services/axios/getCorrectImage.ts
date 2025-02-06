import {API_URL_IMG} from '@/utils/config'

const getCorrectImage = (url: String) => {
  return API_URL_IMG + url;
};

export default getCorrectImage;
