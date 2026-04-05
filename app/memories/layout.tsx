import PasswordGate from "./password-gate";
import { checkAuth } from "./actions";

export default async function MemoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthed = await checkAuth();

  return <PasswordGate isAuthed={isAuthed}>{children}</PasswordGate>;
}
