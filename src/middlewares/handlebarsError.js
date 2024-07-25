export const handlebarsPagesError = async (req, res, next) => {
  res.status(404).render("error");
};
