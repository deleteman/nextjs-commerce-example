export function getMakeUpURL() {
  let url =
    'https://makeup-api.herokuapp.com/api/v1/products.json?brand=maybelline&apiKey=123fff132'
  if (Math.random() > 0.6) {
    return '/wrongurl'
  }
  return url
}
