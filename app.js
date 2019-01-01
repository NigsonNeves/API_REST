const express = require('express');
const app = express();

const morgan = require('morgan');
const bodyParser = require('body-parser');

//settings
app.set('port', process.env.PORT || 3000); 

//middlewares
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));

//routes
require('./src/routes/recipesRoutes')(app);
app.use('*', (req, res) => { //Other cases
    res.status(404).json({
        code: res.statusCode,
        message : "Not Found",
    });
});

//static files

app.listen(app.get('port'), () => {
    console.log('Server is running ' + app.get('port'));
});