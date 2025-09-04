const Favorite = require('.../model/favorite')

class favoriteController{
    async createFavorite(req,res){
        const{roomId,userId}=req.body
        try{
            const favorite = new Favorite({userId,roomId})
            await favorite.save()
            res.status(201).json({
                favorite,
                message:'Đã thêm vào danh sách thích'
            })
        }catch(err){
            res.status(500).json({message:err.message})
        }
    }
}