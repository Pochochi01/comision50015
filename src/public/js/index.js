const socket = io();

socket.on("productos", (data) => {
    renderProductos(data);
}); 

//Función para renderizar la tabla de productos:
const renderProductos = (productos) => {
    const contenedorProductos = document.getElementById("contenedorProductos");
    contenedorProductos.classList.add("contenedorCards");
    contenedorProductos.innerHTML = "";


    productos.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("card");
        //Agregamos boton para eliminar: 
        card.innerHTML = `
                <p class ="p1">Id ${item.id} </p>
                <p class ="p2">Titulo ${item.title} </p>
                <p class ="p2">Precio ${item.price} </p>
                <button class ="buttons"> Eliminar Producto </button>
        
        `;
        contenedorProductos.appendChild(card);

        //Agregamos el evento eliminar producto:
        card.querySelector("button").addEventListener("click", () => {
            eliminarProducto(item.id);
        });
    });
}

//Eliminar producto: 
const eliminarProducto = (id) => {
    socket.emit("eliminarProducto", id);
}

//Agregar producto:

document.getElementById("btnEnviar").addEventListener("click", () => {
    agregarProducto();
});


const agregarProducto = () => {
    const producto = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        price: document.getElementById("price").value,
        thumbnail: document.getElementById("img").value,
        code: document.getElementById("code").value,
        stock: document.getElementById("stock").value,
        category: document.getElementById("category").value,
        status: document.getElementById("status").value === "true"
    };
    
    socket.emit("agregarProducto", producto);
};