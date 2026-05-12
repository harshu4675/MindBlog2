export const formatBytes = (bytes, decimals = 2) => {
  if (!bytes) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
};

export const formatCurrency = (amount, currency = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency }).format(
    amount,
  );

export const formatPercent = (value, total) =>
  total > 0 ? `${Math.round((value / total) * 100)}%` : "0%";

export const stripHtml = (html) => (html ? html.replace(/<[^>]*>/g, "") : "");

export const htmlToText = (html) => {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};

export const extractFirstImage = (html) => {
  const match = html && html.match(/<img[^>]+src="([^"]+)"/);
  return match ? match[1] : null;
};
