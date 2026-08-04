import AuthForm from "../../components/auth/AuthForm";
import LoginSection from "../../components/LoginSection";

export default function SignInPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_35%),linear-gradient(135deg,#0f0f11_0%,#131316_100%)] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col overflow-hidden rounded-4xl border border-zinc-800/80 bg-zinc-950/70 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl lg:flex-row">
        <LoginSection/>
        <section className="flex-1 bg-zinc-950/95 p-6 sm:p-8 lg:p-10">
          <AuthForm />
        </section>
      </div>
    </main>
  );
}