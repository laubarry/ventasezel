// Animación de aparición para productos destacados
document.addEventListener('DOMContentLoaded', () => {
    const productos = document.querySelectorAll('.producto');
    productos.forEach((producto, i) => {
        setTimeout(() => {
            producto.style.transition = 'opacity 0.7s cubic-bezier(.77,0,.18,1), transform 0.7s cubic-bezier(.77,0,.18,1)';
            producto.style.opacity = 1;
            producto.style.transform = 'translateY(0)';
        }, 200 + i * 180);
    });
});