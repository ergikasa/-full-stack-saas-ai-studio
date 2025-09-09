import { response } from "express";
import sql from "../configs/db.js"

export const getUserCreations = async (req,res) =>{
    try {
        const{userId} = req.auth()
        
       const creations = await sql `SELECT * FROM creations WHERE user_id= ${userId} ORDER BY created_at DESC`;
          res.json({succes : true, message: creations});

    } catch (error) {
        res.json({succes : false, message: error.message});
    }
}


export const getPublishCreations = async (req,res) =>{
    try {
        
       const creations = await sql `SELECT * FROM creations WHERE publish = true ORDER BY created_at DESC`;
          res.json({succes : true, message: creations});

    } catch (error) {
        res.json({succes : false, message: error.message});
    }
}


export const toggleLikeCreations = async (req,res) =>{
    try {
        const { userId }= req.auth();
        const { id } = req.body;

        const [creation] = await sql `SELECT * FROM creations WHERE id = ${id}`

        if(!creation){
            response.json({
                succes:false ,message : "creations not found"
            })     
        }
        const current_like =  creation.likes
        const userIdStr = userId.toString();
        let updatedLikes;
        let message;
        if(current_like.includes(userIdStr)){
            updatedLikes = current_like.filter((user) => user !== userIdStr);
            message: "creation unliked"
        } else{
            updatedLikes = [...current_like , userIdStr]
            message : "creation liked"
        }
        const formattedArray = `{${updatedLikes.json(',')}}`

        await sql `UPDATE creations SET likes = ${formattedArray}:: text[] WHERE id = ${id};`
        
        
    
        res.json({succes : true, message });
    } catch (error) {
        res.json({succes : false, message: error.message});
    }
}
