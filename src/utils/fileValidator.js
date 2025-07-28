export const imageFileValidator = (val) => {
  return (
    typeof val === "object" &&
    val !== null &&
    "mimetype" in val &&
    typeof val.mimetype === "string" &&
    val.mimetype.startsWith("image/")
  );
};

export const videoFileValidator = (val) => {
  return (
    typeof val === "object" &&
    val !== null &&
    "mimetype" in val &&
    typeof val.mimetype === "string" &&
    val.mimetype.startsWith("video/")
  );
};
