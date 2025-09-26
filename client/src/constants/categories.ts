export interface CategoryInfo {
  title: string;
  description: string;
  image: string;
}

export const categoryInfo: Record<string, CategoryInfo> = {
    earrings: {
    title: "Earrings",
    description:
      "From timeless studs to dramatic drops, find earrings that express your unique style.",
    image: "https://res.cloudinary.com/dpm2ubwtv/image/upload/v1758831295/sw_jewelry/inventory/itx7dd86jfh4xpas9enz.webp",
  },
  rings: {
    title: "Rings",
    description:
      "From rustic .... to everyday stacking bands, find the perfect ring for any occasion.",
    image: "https://res.cloudinary.com/dpm2ubwtv/image/upload/v1758832511/sw_jewelry/inventory/fwsgvfbv23akpf8m9df2.webp",
  },
  // necklaces: {
  //   title: "Necklaces",
  //   description:
  //     "Discover beautiful necklaces from delicate chains to statement pieces that complete any look.",
  //   image: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800",
  // },
  bracelets: {
    title: "Bracelets",
    description:
      "Thick copper cuffs, intricate wired creations, stackable bangles - choose the perfect finishing touch to your style.",
    image: "https://res.cloudinary.com/dpm2ubwtv/image/upload/v1758832721/sw_jewelry/inventory/rcsrsptte8qsdtnu6wdk.webp",
  },
  other: {
    title: "Other",
    description:
      "Watercolor paintings, vintage goods, home-grown loofas and more.",
    image: "https://res.cloudinary.com/dpm2ubwtv/image/upload/v1758898366/il_570xN.5565677592_mu6m_nghrvv.jpg",
  },
};

// Helper function to get categories as array for iteration
export const getCategoriesArray = () => {
  return Object.entries(categoryInfo).map(([name, info]) => ({
    name,
    ...info,
  }));
};