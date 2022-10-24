import createApiService from './service';
import constants from '../constants';
const api = createApiService(constants.BASE_URL, constants.TIMEOUT, {});

export default api;
