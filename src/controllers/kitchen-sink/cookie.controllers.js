import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const getCookies = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, { cookies: req.cookies }, "Cookies returned"));
});

const setCookie = asyncHandler(async (req, res) => {
  const cookieObject = req.body;

  Object.entries(cookieObject).forEach(([key, value]) => {
    res.cookie(key, value, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // REQUIRED on Railway (HTTPS)
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // REQUIRED for cross-site
      path: "/",
    });
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, { cookies: cookieObject }, "Cookie has been set")
    );
});

const removeCookie = asyncHandler(async (req, res) => {
  const { cookieKey } = req.query;

  return res
    .status(200)
    .clearCookie(cookieKey, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    })
    .json(
      new ApiResponse(
        200,
        { cookies: { ...req.cookies, [cookieKey]: undefined } },
        "Cookie has been cleared"
      )
    );
});

export { getCookies, setCookie, removeCookie };
