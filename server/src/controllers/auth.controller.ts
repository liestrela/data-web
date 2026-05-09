import type { Request, Response } from "express"
import { findUserByName } from "../models/user.model"

export { login }

function login(req : Request, res : Response) {
    const { name, password } = req.body;
    let v = findUserByName(name);
    if (v != undefined) {
        res.json({ message: "Ok"})
    } else {
        res.json({ message: "User not found"})
    }
}