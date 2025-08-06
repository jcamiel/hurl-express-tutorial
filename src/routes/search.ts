import type { Request, Response } from "express";
import express from "express";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
    res.render("search", {
        title: "Search",
    });
});

export default router;
