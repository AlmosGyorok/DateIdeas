import { supabase } from "./supabaseClient.js";
import { mountAuth } from "./auth.js";

mountAuth({ rootId: "auth" });

async function loadIdeas() {
  const grid = document.querySelector(".grid");
  grid.innerHTML = "";

  const { data, error } = await supabase
    .from("date_ideas")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    alert("Nem sikerült betölteni az ötleteket.");
    return;
  }

  data.forEach((idea) => {
    const article = document.createElement("article");
    article.className = "card";

    const titleHtml = idea.link
      ? `<a class="btnlink" href="${idea.link}" target="_blank" rel="noopener noreferrer">${escapeHtml(idea.title)} ↗</a>`
      : `<span class="tag">${escapeHtml(idea.title)}</span>`;

    let imgHtml = "";
    if (idea.image_path) {
      const { data: pub } = supabase.storage
        .from("date-images")
        .getPublicUrl(idea.image_path);

      imgHtml = `<img src="${pub.publicUrl}" alt="${escapeHtml(idea.title)}" loading="lazy" />`;
    }

    article.innerHTML = `<h3>${titleHtml}</h3>${imgHtml}`;
    grid.appendChild(article);
  });
}

function escapeHtml(str) {
  return String(str).replace(
    /[&<>"']/g,
    (m) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[m],
  );
}

loadIdeas();
