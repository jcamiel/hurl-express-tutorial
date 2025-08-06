import type { Request, Response } from "express";
import express from "express";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
    // Destroy the user's session to log them out
    // will be re-created next request.
    req.session.destroy(() => {
        res.redirect("/");
    });
});

export default router;
