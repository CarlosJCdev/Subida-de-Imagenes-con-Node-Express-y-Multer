const express = require('express');
const ejs = require('ejs');
const path = require('path');
const multer= require ('multer');
const { createBrotliCompress } = require('zlib');
/* Con este recurso, podemos generar Id unicos a elementos, el cual
aplicaremos en lugar de colocar el originalName cada que subimos una imagen*/
/* const uuid= require('uuid/dist/v4');  esta forma de traer el modulo ya no funciona*/
const { v4: uuidv4 } = require('uuid');

/*Cuando guardamos la imagen, multer manda por consola, datos especificoa de la imagen como nombre, peso, y un id unico, etc
pero, vamos a defifinir algunos valores que nosostros definiremos, con un metodo de multer */
//Pasamos un objeto
const storage= multer.diskStorage({
    //Tambien debemos definirle la ruta nuevamente de donde guardara las imagenes
    destination: path.join(__dirname, 'public/uploads'),
    filename: (req, file, cb)=>{
        /*Usamos el recurso de uui, para que asinge un id unico,
        y despues concatenamos con el nombre original y especificamos que sea en minusculas*/
        cb(null, uuidv4() + path.extname(file.originalname).toLocaleLowerCase());
    }
});

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
    dest: path.join(__dirname, 'public/uploads'),
    //Con esta confi, podemos especificar el tamaño limite de las imagenes, que se pueden subir
    limits: {fileSize: 2000000},
    //Tambien podemos especificar el formato permitido de los archivos que se intentan subir
    fileFilter: (req, file, cb)=>{
        /* // el valor de la constante es una expresion regular, en la cual le definimos que el tipo solo puede ser de una de la opciones
        ademas en otra ConstantSourceNode, comparamos y validamos que la extencion que ya trae la imagen (mimetype), 
        concuerde con una de la opciones definidas en el (fileType) */
        const fileType= /jpg|jpeg|png|gif/;
        const mimetype= fileType.test(file.mimetype);
        //Ahora en la misma constante extraemos el nombre de la extencion del archivo
        const extname= fileType.test(path.extname(file.originalname));
        if(mimetype && extname){
            return cb(null, true);
        }cb("Error: Extención no valida");
    }
    /* //Multer, tambien necesita, que se le especifique, cuantas imagenes se subiran varias o una a la vez
    ademas de el nombre del input en el html */
}).single('file'));


//Routes, Para mayor orden, el codigo de las rutas se agrego en otro archivo
app.use(require('./routes/index.js'));

//Static files, mostramos las imagenes subidas en el navegador
app.use(express.static(path.join(__dirname, 'public')));

//Iniciar servidor
app.listen(app.get('port'), ()=>{
    console.log(`Server on port ${app.get('port')}`);
});





