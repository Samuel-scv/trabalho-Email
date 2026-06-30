import {Request, Response, NextFunction} from 'express'
import { AuthRequest } from './auth.middlewares.js'

export function AdminMiddleware(req:AuthRequest, res:Response, next:NextFunction){
    if(req.tipo !=="admin"){
      res.status(304).json({error:"vc não o adm"})
    }
    next()
}