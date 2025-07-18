export const asyncHandler = (requestHandler) => {
  (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => {
      res.status(err.code || 500).json({
        success: false,
        message: err.message,
      });
    });
  };
};
