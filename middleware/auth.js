

const login=async(req,res,next) => {
    try{
        if(req.session.user){}
        else{
            res.redirect('/');
        }
        next();

    }catch(err)
    {
        console.error(err.message);
        res.status(500).json({ message: err.message });
    }
}
const logout=async(req,res,next) => {
    try{
        if(req.session.user){
            res.redirect('/dashboard');
        }
       next();

    }catch(err)
    {
        console.error(err.message);
        res.status(500).json({ message: err.message });
    }
}

module.exports={login,logout};

