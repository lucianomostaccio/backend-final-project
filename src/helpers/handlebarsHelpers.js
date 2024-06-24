export function formatPrice(price) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(price);
}

export function if_eq(a, b, opts) {
  if (a == b) {
    return opts.fn(this);
  } else {
    return opts.inverse(this);
  }
}

export function getFirstValidThumbnail(thumbnails) {
  const validThumbnail = thumbnails.find((url) => url);
  return validThumbnail || "https://placehold.co/400";
}

export function categoryImages(category) {
  const images = {
    "Tech & Gadgets":
      "https://media.assettype.com/analyticsinsight%2Fimport%2Fwp-content%2Fuploads%2F2024%2F02%2FTop-Tech-Gadgets-of-2024-A-Glimpse-of-the-Future.jpg",
    "Hobbies & Leisure":
      "https://prh.imgix.net/articles/top10-fiction-1600x800.jpg",
    "Food & Drink":
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThb9RlmTYOG3Lpy5o3KuEul7ROahX0Wl0NMw&s",
    "Home & Living":
      "https://media.licdn.com/dms/image/D4E12AQHHHgTsbzNAIw/article-cover_image-shrink_720_1280/0/1689087652222?e=2147483647&v=beta&t=X9Qe5csCF7mDVIArhdd07TwFtb67kHDJcwtLF7R4D1Q",
    "Health & Wellness":
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnB8kYfRkTBBGDevkaqzl9jTik8wJaIjd9eA&s",
    "Fashion & Accessories":
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSeCpdHH8VNwk8U2F2-D557t-XAAlPfz-TVLw&s",
  };
  return images[category];
}

export function uniqBy(array, key) {
  const seen = new Set();
  return array.filter((item) => {
    const val = item[key];
    if (seen.has(val)) {
      return false;
    }
    seen.add(val);
    return true;
  });
}
