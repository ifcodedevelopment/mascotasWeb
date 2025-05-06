export const mascotaGaleriaDTO = (foto, index) => ({
    index: index,
    id: foto.id_galeria_mascota, 
    url: foto.gl_url || '',
    favorite: (foto.gl_favorito ? true : false),
    rotate: `${(Math.random() * -10).toFixed(2)}deg`
})