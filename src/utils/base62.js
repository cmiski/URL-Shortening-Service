const BASE62 = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

// 62^7 --> 3.5 trillion combinations still collision is being handled

export function generateBase62(length = 7) {
  let result = "";

  for (let i = 0; i < length; i++) {
    result += BASE62[Math.floor(Math.random() * 62)];
  }

  return result;
}
