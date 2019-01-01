const Recipes = require("../models/recipes");
const randomstring = require("randomstring");

module.exports = function(app) {
  app.get("/api/recipes.:format", (req, res) => {
    //Etape 1/7
    const postHeader = {
      word: req.query.name
    };
    //Etape 1/7
    if (req.params.format === "json") {
      if(req.query.name == null){
      Recipes.getRecipes((err, data) => {
        res.status(200).json({
          code: res.statusCode,
          message: "OK",
          datas: data
        });
      });
    } else {
        Recipes.getRecipesByWord(postHeader.word,(err, data) => {
          if (data && data.length > 0) {
          res.status(200).json({
            code: res.statusCode,
            message: "OK",
            datas: data
          });
        } else {
          res.status(400).json({
            code: res.statusCode,
            message: "Specified name does not exist",
          });
        }
        });
      }
    } else {
      res.status(400).json({
        code: res.statusCode,
        message: "Bad Format"
      });
    }
  });

  app.get("/api/recipes/:slug.:format", (req, res) => {
    //Etape 2
    const recipesParam = {
      slug: req.params.slug
    };

    if (req.params.format === "json") {
      Recipes.getRecipesAndUser(recipesParam, (err, data) => {
        if (data && data.length > 0) {
          res.status(200).json({
            code: res.statusCode,
            message: "OK",
            datas: {
              id: data[0].id,
              name: data[0].name,
              user: {
                username: data[0].username,
                last_login: data[0].last_login,
                id: data[0].user_id
              },
              slug: data[0].slug
            }
          });
        } else {
          res.status(404).json({
            code: res.statusCode,
            message: "Not Found"
          });
        }
      });
    } else {
      res.status(400).json({
        code: res.statusCode,
        message: "Bad Request",
        data: "[]"
      });
    }
  });

  app.get("/api/recipes/:slug/steps.:format", (req, res) => {
    //Etape 3
    const recipesParam = {
      slug: req.params.slug
    };

    if (req.params.format === "json") {
      Recipes.getRecipesStepBySlug(recipesParam, (err, data) => {
        if (data && data.length > 0) {
          res.status(200).json({
            code: res.statusCode,
            message: "OK",
            datas: data[0].step.split(",")
          });
        } else {
          res.status(404).json({
            code: res.statusCode,
            message: "Not Found"
          });
        }
      });
    } else {
      res.status(400).json({
        code: res.statusCode,
        message: "Bad Request",
        data: "[]"
      });
    }
  });

  app.post("/api/recipes.:format", (req, res) => {
    //Etape 4

    const postHeader = {
      name: req.body.name,
      slug: req.body.slug,
      step: req.body.step,
      content_type: req.headers["content-type"],
      authorization: req.headers["authorization"]
    };

    if (req.params.format === "json") {
      Recipes.getAuthorizationUser(postHeader, (err, dataAuthorization) => {
        if (dataAuthorization && dataAuthorization.length > 0) {
          if (postHeader.content_type == "application/x-www-form-urlencoded") {
            if (
              postHeader.step == "" ||
              postHeader.step == null ||
              postHeader.name == "" ||
              postHeader.name == null
            ) {
              res.status(400).json({
                code: res.statusCode,
                message: "Bad Request",
                datas: "[Step or name missing]"
              });
            } else {
              Recipes.checkSlug(postHeader.slug, (err, dataSlug) => {
                if (dataSlug && dataSlug.length > 0) {
                  res.status(400).json({
                    code: res.statusCode,
                    message: "Bad Request",
                    datas: "[Slug Already Exist]"
                  });
                } else {
                  if (postHeader.slug == "" || postHeader.slug == null) {
                    postHeader.slug = randomstring.generate(10);
                  }

                  Recipes.insertRecipes(
                    dataAuthorization,
                    postHeader,
                    (err, dataAuthorization) => {
                      Recipes.getInsertedRecipes(
                        postHeader.slug,
                        (err, insertedData) => {
                          res.status(201).json({
                            code: res.statusCode,
                            message: "Created",
                            datas: {
                              id: insertedData[0].id,
                              name: insertedData[0].name,
                              user: {
                                username: insertedData[0].username,
                                last_login: insertedData[0].last_login,
                                id: insertedData[0].user_id
                              },
                              slug: insertedData[0].slug,
                              step: insertedData[0].step
                            }
                          });
                        }
                      );
                    }
                  );
                }
              });
            }
          } else {
            res.status(400).json({
              code: res.statusCode,
              message: "Bad Request",
              datas: "[Wrong Content-Type]"
            });
          }
        } else {
          res.status(401).json({
            code: res.statusCode,
            message: "Unauthorized"
          });
        }
      });
    } else {
      res.status(400).json({
        code: res.statusCode,
        message: "Bad Request",
        datas: "[Bad Format]"
      });
    }
  });

  app.put("/api/recipes/:slug.:format", (req, res) => {
    const postHeader = {
      name: req.body.name,
      slug: req.body.slug,
      step: req.body.step,
      content_type: req.headers["content-type"],
      authorization: req.headers["authorization"]
    };

    if (req.params.format === "json") {
      Recipes.getAuthorizationUser(postHeader, (err, dataAuthorization) => {
        if (dataAuthorization && dataAuthorization.length > 0) {
          if (postHeader.content_type == "application/x-www-form-urlencoded") {
            Recipes.checkSlug(req.params.slug, (err, dataSlug) => {
              if (dataSlug && dataSlug.length > 0) {
                if (postHeader.slug != null) {
                  Recipes.checkSlug(postHeader.slug, (err, dataHeaderSlug) => {
                    if (dataHeaderSlug && dataHeaderSlug.length > 0) {
                      res.status(400).json({
                        code: res.statusCode,
                        message: "Slug Already Exist"
                      });
                    } else {
                      if (dataSlug[0].user_id == dataAuthorization[0].id) {
                        if (
                          postHeader.name == "" ||
                          postHeader.step == "" ||
                          postHeader.slug == ""
                        ) {
                          res.status(400).json({
                            code: res.statusCode,
                            message: "Bad Request",
                            datas: "There is an empty field"
                          });
                        } else {
                          Recipes.updateRecipes(
                            req.body,
                            dataSlug[0].id,
                            (err, dataUpdate) => {}
                          );
                          Recipes.getInsertedRecipes(
                            postHeader.slug,
                            (err, insertedData) => {
                              res.status(200).json({
                                code: res.statusCode,
                                message: "OK",
                                datas: {
                                  id: insertedData[0].id,
                                  name: insertedData[0].name,
                                  user: {
                                    username: insertedData[0].username,
                                    last_login: insertedData[0].last_login,
                                    id: insertedData[0].user_id
                                  },
                                  slug: insertedData[0].slug
                                }
                              });
                            }
                          );
                        }
                      } else {
                        res.status(403).json({
                          code: res.statusCode,
                          message: "Forbidden"
                        });
                      }
                    }
                  });
                } else {
                  if (dataSlug[0].user_id == dataAuthorization[0].id) {
                    if (
                        postHeader.name == "" ||
                        postHeader.step == "" ||
                        postHeader.slug == ""
                      ) {
                        res.status(400).json({
                          code: res.statusCode,
                          message: "Bad Request",
                          datas: "There is an empty field"
                        });
                      } else {  
                    Recipes.updateRecipes(
                      req.body,
                      dataSlug[0].id,
                      (err, dataUpdate) => {}
                    );
                    Recipes.getInsertedRecipes(
                      req.params.slug,
                      (err, insertedData) => {
                        res.status(200).json({
                          code: res.statusCode,
                          message: "OK",
                          datas: {
                            id: insertedData[0].id,
                            name: insertedData[0].name,
                            user: {
                              username: insertedData[0].username,
                              last_login: insertedData[0].last_login,
                              id: insertedData[0].user_id
                            },
                            slug: insertedData[0].slug
                          }
                        });
                      }
                    );
                }
                  } else {
                    res.status(403).json({
                      code: res.statusCode,
                      message: "Forbidden"
                    });
                  }
                }
              } else {
                res.status(404).json({
                  code: res.statusCode,
                  message: "Slug Not Found"
                });
              }
            });
          } else {
            res.status(400).json({
              code: res.statusCode,
              message: "Bad Request",
              datas: "[Wrong Content-Type]"
            });
          }
        } else {
          res.status(401).json({
            code: res.statusCode,
            message: "Unauthorized"
          });
        }
      });
    } else {
      res.status(400).json({
        code: res.statusCode,
        message: "Bad Request",
        datas: "[Bad Format]"
      });
    }
  });

  app.delete("/api/recipes/:slug.:format", (req, res) => {
    //Etape 6

    const postHeader = {
      slug: req.params.slug,
      authorization: req.headers["authorization"]
    };

    if (req.params.format === "json") {
      Recipes.getAuthorizationUser(postHeader, (err, dataAuthorization) => {
        if (dataAuthorization && dataAuthorization.length > 0) {
          Recipes.checkSlug(postHeader.slug, (err, dataSlug) => {
            if (dataSlug && dataSlug.length > 0) {
              if (dataSlug[0].user_id == dataAuthorization[0].id) {
                res.status(200).json({
                  code: res.statusCode,
                  message: "success",
                  datas: {
                    id: dataSlug[0].id
                  }
                });
                Recipes.deleteRecipes(
                  postHeader.slug,
                  (err, deletedData) => {}
                );
              } else {
                res.status(403).json({
                  code: res.statusCode,
                  message: "Forbidden"
                });
              }
            } else {
              res.status(404).json({
                code: res.statusCode,
                message: "Not Found"
              });
            }
          });
        } else {
          res.status(401).json({
            code: res.statusCode,
            message: "Unauthorized"
          });
        }
      });
    } else {
      res.status(400).json({
        code: res.statusCode,
        message: "Bad Request",
        datas: "Bad Format"
      });
    }
  });
};
