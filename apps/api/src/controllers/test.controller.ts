import { Request, Response} from "express";
// import { Project } from "../models/project.models";
import { sumService, cubeService, squareService } from "../services/test.services";


//test roues for practice 
export const sum = (req: Request, res: Response) => {
  const { a, b } = req.body;

  if (typeof a !== "number" || typeof b !== "number") {
    return res.status(400).json({ error: "a and b must be numbers" });
  }

  res.json({ result: sumService });
};

export const square = (req: Request, res: Response) => {
    try {
        const { a } = req.body;
        if (typeof a !== "number") {
            return res.status(404).json({ error: "a and b are not numbers"});
        } else {
            res.json({ result: squareService})
        }
    } catch(error) {
      res.status(500).json({ message: "Error fething the url"})
    }
}

export const cube = (req: Request, res: Response) => {
    const {a} = req.body;
    if (typeof a !== "number") {
        return res.status(404).json({ error: "a is not a number"});

    }else {
        res.json({ result: cubeService})
    }
}