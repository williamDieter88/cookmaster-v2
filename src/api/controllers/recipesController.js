const recipesService = require('../services/recipesService');
const { imageUpload } = require('../multer');

const CREATED = 201;
const OK = 200;
const NOT_FOUND = 404;

const createRecipe = async (req, res) => {
  const { name, ingredients, preparation } = req.body;

  const newRecipe = await recipesService.createRecipe(name, ingredients, preparation);

  if (newRecipe.isError) return res.status(newRecipe.status).json({ message: newRecipe.message });
  return res.status(CREATED).json({ 
    recipe: newRecipe,
  });
};

const getAllRecipes = async (req, res) => {
  const result = await recipesService.getAllRecipes();
  return res.status(OK).json(result);
  };

const getRecipesById = async (req, res) => {
  const { id } = req.params;
  const result = await recipesService.getRecipesById({ id });
  if (!result) return res.status(NOT_FOUND).send({ message: 'recipe not found' });
  return res.status(OK).json(result);
  };
  
const updateRecipe = async (req, res) => {
  const { id } = req.params;
  const { body } = req;
  await recipesService.updateRecipe(id, body);
  res.status(200).json(
      {
         _id: id,
         name: body.name,
         ingredients: body.ingredients,
         preparation: body.preparation,
         userId: id,
      },
      );
  };

const deleteRecipe = async (req, res) => {
  const { id } = req.params;
  const result = await recipesService.deleteRecipe(id);
  return res.status(204).json(result);
  };

// const updateRecipeWithImage = async (req, res) => {
//     const { id } = req.params;
//     const { filename } = req.file;
//     const image = `localhost:3000/src/uploads/${filename}`;
//     const response = await recipesService.updateRecipeWithImage(id, image);
//     res.status(200).json(response);
//   };
  
  const updateRecipeWithImage = [imageUpload.single('image'), async (req, res) => {
    const { id } = req.params;
    const { path } = req.file;
    const recipeWithImage = await recipesService.updateRecipeWithImage(id, path);
    return res.status(200).json(recipeWithImage);
  }];

module.exports = {
  createRecipe,
  getAllRecipes,
  getRecipesById,
  updateRecipe,
  deleteRecipe,
  updateRecipeWithImage,
};