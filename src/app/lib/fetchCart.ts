export async function fetchCart() {
  const res = await fetch('/api/cart', {
    method: 'GET',
    credentials: 'include',
  });
  if (res.status === 401) {
    console.log('Unauthorized, please login');
  }
  const data = await res.json();
  return data;
}
