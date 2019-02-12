module.exports = {
	increment: function(req, res){
		console.log("Adding!!!")
    res.send(req.body.number + 1)
	}
}