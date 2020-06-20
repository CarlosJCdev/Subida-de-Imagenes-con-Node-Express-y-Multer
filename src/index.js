const express = require('express');
const ejs = require('ejs');
const path = require('path');
const multer= require ('multer');


/*Cuando guardamos la imagen, multer manda por consola, datos especificoa de la imagen como nombre, peso, y un id unico, etc
pero, vamos a defifinir algunos valores que nosostros definiremos, con un metodo de multer */
//Pasamos un objeto
const storage= multer.diskStorage({
    //Tambien debemos definirle la ruta nuevamente de donde guardara las imagenes
    destination: path.join(__dirname, 'public/uploads'),
    filename: (req, file, callback)=>{
        callback(null, file.originalname);
    }
})

//Iniciar servicios
const app= express();
//Puertos
//Especificamos la ruta en donde esta la estructura de la pagina, en la carpeta views
//Especificamos el tipo de formato de la pagina, ejs
app.set('port', 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/* Subimos las imagenes a multer, este codigo debe ser antes de asignar las rutas, por que ncesita primero entender
Las caracteristicas de la imagen y luego definir las rutas, esto se conoce como middlewares, antes
de subir la imagen se debe procesar la imagen */
//Le pasaremos un objeto a multer, el cual necesita para saber como procesar la imagen, donde guardarla por ejemplo
app.use(multer({
    storage: storage,
    /* Especificamos tambien, la ruta donde guarde las fotos, en este caso, le especificamos que sea dentro de src  */
    dest: path.join(__dirname, 'public/uploads')
    /* //Multer, tambien necesita, que se le especifique, cuantas imagenes se subiran varias o una a la vez
    ademas de el nombre del input en el html */
}).single('file'));


//Routes
app.get('/', (req, res)=>{
    res.render('index');
});
//Ruta para la subida de la imagen, e igual manejamos la peticion con un manejador de peticiones
app.post('/upload', (req, res)=>{
    //Cuando multer procesa la foto la guarda en una variable llamada req.file
    console.log(req.file);
    res.send('uploaded');
});

//Iniciar servidor
app.listen(app.get('port'), ()=>{
    console.log(`Server on port ${app.get('port')}`);
});





