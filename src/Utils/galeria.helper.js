export const asegurarImagenFavorita = (galery = []) => {
    if (!Array.isArray(galery)) return [];

    const tieneFavorite = galery.some(img => img.favorite === true);

    if (!tieneFavorite && galery != null) {
        galery[0].favorite = true;
    }

    return galery;
};
