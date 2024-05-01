document.addEventListener('DOMContentLoaded', () => {
    const imageInputs = document.querySelectorAll('#image-container input[type="file"]');
    const mapContainer = document.getElementById('map-container');
    const margin7Btn = document.getElementById('margin-7');
    const margin3Btn = document.getElementById('margin-3');
    const gridSquares = [];
    let selectedSquares = new Set(); // Conjunto para almacenar casillas seleccionadas
    let selectedMargin = 7; // Margen por defecto

    // Cargar imágenes al hacer clic en el botón correspondiente
    imageInputs.forEach(input => {
        input.addEventListener('change', loadImages);
    });

    function loadImages() {
        const images = [];

        imageInputs.forEach(input => {
            if (input.files.length > 0) {
                images.push(input.files[0]);
            }
        });

        if (images.length > 0) {
            const canvas = document.createElement('canvas');
            canvas.width = 1280;
            canvas.height = 1280;
            const ctx = canvas.getContext('2d');

            images.forEach((image, index) => {
                const x = index % 2 === 0 ? 0 : 640;
                const y = index < 2 ? 0 : 640;
                const img = new Image();
                img.src = URL.createObjectURL(image);
                img.onload = () => {
                    ctx.drawImage(img, x, y, 640, 640);
                    if (index === images.length - 1) {
                        mapContainer.style.backgroundImage = `url(${canvas.toDataURL()})`;
                        createGridSquares();
                    }
                };
            });
        }
    }

    // Crear cuadrícula de casillas
    function createGridSquares() {
        gridSquares.length = 0;
        mapContainer.innerHTML = '';

        for (let y = 0; y < 32; y++) {
            for (let x = 0; x < 32; x++) {
                const square = document.createElement('div');
                square.classList.add('grid-square');
                square.dataset.x = x;
                square.dataset.y = y;
                square.style.left = `${x * 40}px`;
                square.style.top = `${y * 40}px`;
                square.addEventListener('click', () => toggleSquare(square));
                square.addEventListener('dblclick', () => doubleClickSquare(square));
                mapContainer.appendChild(square);
                gridSquares.push(square);
            }
        }
    }

    // Función para manejar el clic en una casilla
    function toggleSquare(square) {
        if (selectedSquares.has(square)) {
            // Deseleccionar la casilla si ya está seleccionada
            deselectSquare(square);
        } else {
            // Seleccionar la casilla
            selectSquare(square);
        }
    }

    // Función para seleccionar una casilla
    function selectSquare(square) {
        selectedSquares.add(square);
        square.classList.add('selected');
        updateValidSquares();
    }

    // Función para deseleccionar una casilla
    function deselectSquare(square) {
        selectedSquares.delete(square);
        square.classList.remove('selected');
        updateValidSquares();
    }

    // Función para manejar el doble clic en una casilla
    function doubleClickSquare(square) {
        if (selectedSquares.has(square)) {
            deselectSquare(square);
        }
    }

    // Función para actualizar casillas válidas y aplicar estilos
    function updateValidSquares() {
        gridSquares.forEach(square => {
            const { x, y } = square.dataset;
            const cx = parseInt(x);
            const cy = parseInt(y);
            const isValid = Array.from(selectedSquares).every(selectedSquare => {
                const { x: sx, y: sy } = selectedSquare.dataset;
                const selectedX = parseInt(sx);
                const selectedY = parseInt(sy);
                const distance = Math.max(Math.abs(cx - selectedX), Math.abs(cy - selectedY));
                return distance > selectedMargin;
            });

            if (isValid) {
                square.classList.add('valid');
            } else {
                square.classList.remove('valid');
            }
        });
    }

    // Evento para cambiar el margen seleccionado a 7
    margin7Btn.addEventListener('click', () => {
        selectedMargin = 7;
        updateValidSquares();
    });

    // Evento para cambiar el margen seleccionado a 3
    margin3Btn.addEventListener('click', () => {
        selectedMargin = 3;
        updateValidSquares();
    });
});
