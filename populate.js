Race.findOne({ x_reference: "sou1705112503sco" }).populate('horses').exec(function(err, race){
                        if (err) {
                            console.log(err)
                        }
                    })