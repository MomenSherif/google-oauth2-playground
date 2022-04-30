export function If({
  condition,
  children,
}: {
  condition: boolean;
  children: React.ReactNode;
}) {
  return condition ? <>{children}</> : null;
}

export function decodeJwt(token: string) {
  try {
    return JSON.parse(window.atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
}
