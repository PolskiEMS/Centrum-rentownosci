"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, BarChart3, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "../../lib/supabase/client";

export default function AuthPanel() {
  const router = useRouter();
  const [mode, setMode] = useState("login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const isRegister = mode === "register";

  function switchToLogin() {
    setMode("login");
    setMessage("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const supabase = getSupabaseBrowserClient();

      if (isRegister) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName.trim() },
            emailRedirectTo: `${window.location.origin}/dashboard`,
          },
        });

        if (error) throw error;
        setMessage("Konto zostało utworzone. Sprawdź skrzynkę e-mail i potwierdź rejestrację.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error) {
      setMessage(error?.message || "Nie udało się wykonać operacji.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-hero">
        <div className="brand-mark"><BarChart3 size={26} /></div>
        <div>
          <p className="eyebrow">Analiza biznesowa</p>
          <h1>Centrum Rentowności</h1>
          <p className="hero-copy">
            Zapisuj kalkulacje, analizuj trasy i kontroluj rentowność swojej działalności w jednym miejscu.
          </p>
        </div>

        <div className="auth-benefits">
          <div><ShieldCheck size={20} /><span>Prywatne dane każdego użytkownika</span></div>
          <div><BarChart3 size={20} /><span>Kalkulatory dla wielu branż</span></div>
          <div><LockKeyhole size={20} /><span>Bezpieczne logowanie przez Supabase</span></div>
        </div>
      </section>

      <section className="auth-card-wrap">
        <div className="auth-card">
          <div className="auth-tabs" role="tablist">
            <button className={mode === "login" ? "active" : ""} onClick={switchToLogin} type="button">Logowanie</button>
            <button className={mode === "register" ? "active" : ""} onClick={() => { setMode("register"); setMessage(""); }} type="button">Rejestracja</button>
          </div>

          <div className="auth-heading">
            <h2>{isRegister ? "Utwórz konto" : "Witaj ponownie"}</h2>
            <p>{isRegister ? "Załóż własne konto i zapisuj swoje analizy." : "Zaloguj się, aby przejść do swojego panelu."}</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {isRegister && (
              <label>
                <span>Imię i nazwisko</span>
                <div className="input-wrap"><UserRound size={18} /><input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Jan Kowalski" required /></div>
              </label>
            )}

            <label>
              <span>Adres e-mail</span>
              <div className="input-wrap"><Mail size={18} /><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="twoj@email.pl" required /></div>
            </label>

            <label>
              <span>Hasło</span>
              <div className="input-wrap">
                <LockKeyhole size={18} />
                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Minimum 6 znaków" minLength={6} required />
                <button className="password-toggle" type="button" onClick={() => setShowPassword((value) => !value)} aria-label="Pokaż lub ukryj hasło">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
              </div>
            </label>

            {message && <p className="auth-message">{message}</p>}

            <button className="auth-submit" disabled={loading} type="submit">
              <span>{loading ? "Proszę czekać..." : isRegister ? "Utwórz konto" : "Zaloguj się"}</span>
              {!loading && <ArrowRight size={18} />}
            </button>

            {isRegister && (
              <button className="auth-back" type="button" onClick={switchToLogin}>
                <ArrowLeft size={18} />
                <span>Wróć do logowania</span>
              </button>
            )}
          </form>

          <p className="auth-note">Tworząc konto, akceptujesz przyszły regulamin i politykę prywatności platformy.</p>
        </div>
      </section>
    </main>
  );
}
