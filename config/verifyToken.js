import jwt from "jsonwebtoken";
import { createError } from "../utils/error.js";


export const verifyToken = (req, res, next) => {
    if (req.headers.authorization) {
      jwt.verify(req.headers.authorization, process.env.JWT, (err, user) => {
        if (err) return next(createError(403, "Token is not valid!"));
        req.user = user;
        next();
      });
    } else {
      res
        .status(401)
        .json({ sucess: "false", message: "Your are not Authorized" });
    }
  };