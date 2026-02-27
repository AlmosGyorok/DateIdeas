import { supabase } from "./supabaseClient.js";
import { mountAuth, requireAuth } from "./auth.js";

const auth = mountAuth({ rootId: "auth" });

function safeFileName(name) {
  return String(name).replace(/[^a-z0-9.\-_]/gi, "_");
}

document.getElementById("ideaForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value.trim();
  const link = document.getElementById("link").value.trim();
  const file = document.getElementById("image").files?.[0];

  if (!title) return alert("Adj meg egy program nevet!");

  // biztosítsuk hogy friss session legyen
  if (auth?.refresh) await auth.refresh();
  const session = await requireAuth();
  if (!session) return alert("Előbb lépj be (email link), hogy tudj menteni.");

  let image_path = null;

  if (file) {
    const userId = session.user.id;
    image_path = `${userId}/${Date.now()}_${safeFileName(file.name)}`;

    const { error: uploadError } = await supabase.storage
      .from("date-images")
      .upload(image_path, file, { upsert: false });

    if (uploadError) {
      console.error(uploadError);
      return alert("Kép feltöltés nem sikerült.");
    }
  }

  const { error: insertError } = await supabase.from("date_ideas").insert([
    {
      title,
      link: link || null,
      image_path,
      created_by: session.user.id,
    },
  ]);

  if (insertError) {
    console.error(insertError);
    return alert("Mentés nem sikerült.");
  }

  window.location.href = "index.html";
});
