import rateLimit from "express-rate-limit"

const _rateLimitor = rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    message: {
        success: false,
        message: "Too many requests. Try again later."
    }
})
export default _rateLimitor