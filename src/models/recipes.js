const mysql = require('mysql');

connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'saint-vincent',
    database: 'etna_api'
});

let recipesModel = {};

recipesModel.getRecipes = (callback) => { //Etape 1
    if(connection) {
        connection.query(
            'SELECT id,name,slug FROM recipes__recipe ORDER BY id',
            (err, rows) => {
                if (err) {
                    throw err;
                } else {
                    callback(null, rows); //Null because there is no error
                }
            }
        )
    }
};

recipesModel.getRecipesAndUser = (recipesParam,callback) => { //Etape 2 
    if(connection) {
        connection.query(
            "SELECT recipes__recipe.id,recipes__recipe.name,recipes__recipe.slug,users__user.username,users__user.last_login,recipes__recipe.user_id FROM recipes__recipe join users__user on users__user.id = recipes__recipe.user_id WHERE recipes__recipe.slug = '"+recipesParam.slug+"' ORDER BY recipes__recipe.id",
            (err, rows) => {
                if (err) {
                    throw err;
                } else {
                    callback(null, rows); //Null because there is no error
                }
            }
        )
    }
};

recipesModel.getRecipesStepBySlug = (recipesParam,callback) => { //Etape 3
    if(connection) {
        connection.query(
            "SELECT step FROM recipes__recipe WHERE slug = '"+recipesParam.slug+"'",
            (err, rows) => {
                if (err) {
                    throw err;
                } else {
                    callback(null, rows); //Null because there is no error
                }
            }
        )
    }
};

recipesModel.getAuthorizationUser = (postHeader,callback) => { //Etape 4 / 5
    if(connection) {
        connection.query(
            "SELECT id,username,last_login FROM users__user WHERE password = '"+postHeader.authorization+"'",
            (err, rows) => {
                if (err) {
                    throw err;
                } else {
                    callback(null, rows); //Null because there is no error
                }
            }
        )
    }
};

recipesModel.checkSlug = (slug,callback) => {
    if(connection) {
        connection.query(
            "SELECT id,user_id,name,slug,step FROM recipes__recipe WHERE slug = '"+slug+"'",
            (err, rows) => {
                if (err) {
                    throw err;
                } else {
                    callback(null, rows); //Null because there is no error
                }
            }
        )
    }

};

recipesModel.insertRecipes = (dataAuthorization,postHeader,callback) => {
    if(connection) {
        connection.query(
            "INSERT INTO recipes__recipe (user_id,name,slug,step) VALUES ('"+dataAuthorization[0].id+"','"+postHeader.name+"','"+postHeader.slug+"','"+postHeader.step.toString()+"')",
            (err, rows) => {
                if (err) {
                    throw err;
                } else {
                    callback(null, rows); //Null because there is no error
                }
            }
        )
    }
};

recipesModel.getInsertedRecipes = (slug,callback) => {
    if(connection) {
        connection.query(
            "SELECT recipes__recipe.id,recipes__recipe.name,users__user.username,users__user.last_login,recipes__recipe.user_id,recipes__recipe.slug,recipes__recipe.step FROM recipes__recipe JOIN users__user ON users__user.id = recipes__recipe.user_id WHERE recipes__recipe.slug = '"+slug+"';",
            (err, rows) => {
                if (err) {
                    throw err;
                } else {
                    callback(null, rows); //Null because there is no error
                }
            }
        )
    }
};

recipesModel.updateRecipes = (tab,id,callback) => {
    for (var key in tab) {
        if(connection) {
            if (tab.hasOwnProperty(key)) {
                item = tab[key];

                connection.query(
                    "UPDATE recipes__recipe SET "+key+" = '"+item.toString()+"' WHERE recipes__recipe.id = '"+id+"';",
                    (err, rows) => {
                        if (err) {
                            throw err;
                        } else {
                            callback(null, rows); //Null because there is no error
                        }
                    }
                )
            }   
        }
    }
};

recipesModel.deleteRecipes = (slug,callback) => {
    if(connection) {
        connection.query(
            "DELETE FROM recipes__recipe WHERE recipes__recipe.slug = '"+slug+"';",
            (err, rows) => {
                if (err) {
                    throw err;
                } else {
                    callback(null, rows); //Null because there is no error
                }
            }
        )
    }
};

recipesModel.getRecipesByWord = (word,callback) => {
    if(connection) {
        connection.query(
            "SELECT id,name,slug FROM recipes__recipe WHERE name LIKE '%"+word+"%';",
            (err, rows) => {
                if (err) {
                    throw err;
                } else {
                    callback(null, rows); //Null because there is no error
                }
            }
        )
    }
};



module.exports = recipesModel;