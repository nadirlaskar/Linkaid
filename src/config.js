export const hostname =  process.env.NODE_ENV!=="development"?"https://link-aid.org":"http://localhost:8080";
export const google_api_key =  process.env.GMAP_KEY;
export const GA_KEY = process.env.GA_KEY;
export default {
    hostname,
    google_api_key
}