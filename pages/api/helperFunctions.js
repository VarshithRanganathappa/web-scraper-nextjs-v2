import axios from "axios";

export function getFullUrl(url, str) {
  
  const hostname = getHostname(url);

  if(!str || str === '' || str.startsWith('#')) return null;
  if (str.startsWith("http") || str.startsWith("https") || str.startsWith("www")) {
    if(!str.includes(getHostname(url)))
      return null;
    return str;
  } 
  else if(str.startsWith(getHostname(url))) {
    return getUrlProtocol(url) + "//" + hostname + str;
  }
  else if (str.startsWith("/")) {
    return getUrlProtocol(url) + "//" + hostname + str;
  } 
  else {
    return getUrlProtocol(url) + "//" + hostname + str;
  }
}

export function getHostname(url) {
  return new URL(url).hostname;
}

export function getUrlProtocol(url) {
  return new URL(url).protocol;
}

export async function axiosGet(url) {
  try {
    return await axios.get(url);
  }
  catch (error) {
    console.error(error);
    return null;
  }

}

export async function axiosPost(url, data, config) {
  try {
    return await axios.post(url, data, config);
  } catch (error) {
    console.error(error);
    return null;
  }
}


