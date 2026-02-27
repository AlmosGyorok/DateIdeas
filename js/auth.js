// js/auth.js
import { supabase } from "./supabaseClient.js";

export function mountAuth({
  rootId = "auth",
  redirectTo = window.location.origin + window.location.pathname,
} = {}) {
  const root = document.getElementById(rootId);
  if (!root) return;

  root.innerHTML = `
    <div class="card" style="margin-bottom:16px">
      <h3>Belépés</h3>
      <div style="display:flex; gap:8px; flex-wrap:wrap;">
        <input id="authEmail" type="email" placeholder="email" style="flex:1; min-width:220px;" />
        <button id="authLoginBtn" type="button">Belépés email linkkel</button>
        <button id="authLogoutBtn" type="button" style="display:none;">Kijelentkezés</button>
      </div>
      <p id="authInfo" class="tag" style="margin-top:10px;"></p>
    </div>
  `;

  const emailEl = root.querySelector("#authEmail");
  const loginBtn = root.querySelector("#authLoginBtn");
  const logoutBtn = root.querySelector("#authLogoutBtn");
  const infoEl = root.querySelector("#authInfo");

  async function refresh() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.user?.email) {
      infoEl.textContent = `Belépve: ${session.user.email}`;
      loginBtn.style.display = "none";
      emailEl.style.display = "none";
      logoutBtn.style.display = "inline-block";
      root.dataset.authed = "true";
    } else {
      infoEl.textContent = "Nincs belépve";
      loginBtn.style.display = "inline-block";
      emailEl.style.display = "inline-block";
      logoutBtn.style.display = "none";
      root.dataset.authed = "false";
    }

    return session;
  }

  loginBtn.addEventListener("click", async () => {
    const email = (emailEl.value || "").trim();
    if (!email) return alert("Adj meg egy email címet!");

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo },
    });

    if (error) {
      console.error(error);
      return alert("Belépés nem sikerült.");
    }
    alert("Küldtem egy belépő linket emailben.");
  });

  logoutBtn.addEventListener("click", async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error(error);
    await refresh();
  });

  // Session változás figyelés
  supabase.auth.onAuthStateChange(() => refresh());

  return { refresh };
}

export async function requireAuth() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) return null;
  return session;
}
