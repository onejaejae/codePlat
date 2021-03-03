import axios from "axios";
import { SERVER_URL } from "../constant/constant";

/**
 * @author 박진호
 * @version 1.0
 * @summary global axios 설정을 위한 파일
 */

axios.defaults.baseURL = `${SERVER_URL}`;
axios.defaults.withCredentials = true;

const client = axios.create();

export default client;
