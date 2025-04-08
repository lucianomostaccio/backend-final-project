// improvedReplies.js
// Middleware para proporcionar métodos mejorados de respuesta para la API

export const improvedReplies = (req, res, next) => {
  // Respuesta para recursos creados exitosamente - 201 Created
  res["created"] = (payload) => {
    res.status(201).json({
      status: "success",
      message: "Resource created successfully",
      payload,
    });
  };

  // Respuesta para operaciones exitosas sin contenido - 204 No Content
  res["ok"] = () => {
    res.status(204).send();
  };

  // Respuesta para operaciones exitosas con contenido - 200 OK
  res["jsonOk"] = (payload) => {
    res.status(200).json({
      status: "success",
      payload,
    });
  };

  // Respuesta para errores - Usa el código de estado proporcionado o 500 por defecto
  res["jsonError"] = (error, statusCode = 500) => {
    res.status(error.statusCode || statusCode).json({
      status: "error",
      message: error.message || "Internal server error",
      error: error.name || "UnknownError",
    });
  };

  // Respuesta para operaciones exitosas con paginación - 200 OK
  res["jsonPaginated"] = (data, pagination) => {
    res.status(200).json({
      status: "success",
      payload: data,
      pagination: {
        totalDocs: pagination.totalDocs,
        limit: pagination.limit,
        totalPages: pagination.totalPages,
        page: pagination.page,
        hasPrevPage: pagination.hasPrevPage,
        hasNextPage: pagination.hasNextPage,
        prevPage: pagination.prevPage,
        nextPage: pagination.nextPage,
      },
    });
  };

  // Respuesta para actualizaciones exitosas - 200 OK
  res["updated"] = (payload) => {
    res.status(200).json({
      status: "success",
      message: "Resource updated successfully",
      payload,
    });
  };

  // Respuesta para eliminaciones exitosas - 200 OK
  res["deleted"] = (identifier) => {
    res.status(200).json({
      status: "success",
      message: "Resource deleted successfully",
      identifier,
    });
  };

  next();
};
