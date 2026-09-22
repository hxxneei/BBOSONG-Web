import axios from "axios";
import { COMMON_AXIOS_CONFIG } from "./apiConfig";

const publicAxios = axios.create(COMMON_AXIOS_CONFIG);

export default publicAxios;
