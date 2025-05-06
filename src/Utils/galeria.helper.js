export const asegurarImagenFavorita = (galery = []) => {
    if (!Array.isArray(galery)) return [];

    const tieneFavorite = galery.some(img => img.favorite === true);

    if (!tieneFavorite && galery.length > 0) {
        galery[0].favorite = true;
    }

    return galery;
};
