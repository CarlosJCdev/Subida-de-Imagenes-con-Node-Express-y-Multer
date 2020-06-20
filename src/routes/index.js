const {Router} =require('express');
const router = Router();

//Routes, esta ruta inicial nos pinta el formulario que tenemos en el html
router.get('/', (req, res)=>{
    res.render('index');
});
//Ruta para la subida de la imagen, e igual manejamos la peticion con un manejador de peticiones, la ruta en si recibe las imagenes
router.post('/upload', (req, res)=>{
    //Cuando multer procesa la foto la guarda en una variable llamada req.file, y es la info que se ve en la terminal de VSC
    console.log(req.file);
    res.send('uploaded');
});

module.exports= router;