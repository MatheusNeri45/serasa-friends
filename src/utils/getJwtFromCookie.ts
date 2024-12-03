"use client"
export function getJwtFromCookie() {
  if (typeof window !== 'undefined') {
    const cookies = document.cookie.split(';');
    let token = null;
  
    cookies.forEach(cookie => {
      if (cookie.trim().startsWith('token=')) {
        token = cookie.split('=')[1];
      }
    });
  
    return token;
  }
  
  return null;
}
