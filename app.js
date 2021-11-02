const { urlencoded } = require("express")
const express = require("express")
const app = express()
const mongoose = require("mongoose")
const _ = require("lodash")

app.set("view engine", "ejs")
app.use(urlencoded({extended: true}))
app.use(express.static("public"))

const mongoURL = "mongodb+srv://va-admin:diokeren6@cluster0.gkfbx.mongodb.net/toDoListDB"
mongoose.connect(mongoURL)



const listSchema = new mongoose.Schema({
    name: String,
})
const List = mongoose.model("List", listSchema)

const itemSchema = new mongoose.Schema({
    name: String,
    item: [listSchema]
})
const Item = mongoose.model("Item", itemSchema)


const item1 = new List({
    name: "Welcome to your todolist!"
  });
  
  const item2 = new List({
    name: "Hit the + button to add a new item."
  });
  
  const item3 = new List({
    name: "<-- Hit this to delete an item."
  });

const defaultList = [item1, item2, item3]


app.get("/", function(req, res){
    List.find({}, function(err, foundList){
        if (foundList.length === 0){
            List.insertMany(defaultList, function(err){
                if (err){
                    console.log(err)
                } else {
                    console.log("Succesfully Save List")
                }
            }) 
            res.redirect("/")
        } else {
            res.render("list", {listTitle: "Today", listItems: foundList})
        }
    })
    
})

app.get("/:customItem", function(req, res){
    itemName = _.capitalize(req.params.customItem)
    Item.findOne({name: itemName}, function(err, foundItem){
        
        if (!err){
            if (!foundItem){
                const item = new Item({
                    name: itemName,
                    item: defaultList
                })
                item.save()
                res.redirect("/" + itemName)
            } else {
                res.render("list", {listTitle: itemName, listItems: foundItem.item})
            }
        } 
    })
})

app.post("/", function(req, res){
   const newList = req.body.newItem
   const newItem = req.body.newList

   const item = new List({
       name: newList
   })
   
   if (newItem === "Today"){
    const list = new List({
        name: newList
    })
    list.save()
    res.redirect("/")
   } else {
       Item.findOne({name: newItem}, function(err, foundItem){
           foundItem.item.push(item)
           foundItem.save()
           res.redirect("/" + newItem)
       })
   }
})

app.post("/delete", function(req, res){
    deleteList = req.body.checkbox
    itemName = req.body.itemName
    console.log(deleteList)
    console.log(itemName)
    if (itemName === "Today"){
        List.findByIdAndRemove(deleteList, function(err){
            if (err){
                console.log(err)
            } else {
                res.redirect("/")
            }
        })
    } else { 
        Item.findOneAndUpdate({name: itemName}, {$pull: {item: {_id: deleteList}}}, function(err, foundList){
            if (!err){
                res.redirect("/" + itemName)
            }
        })
    }
    
})

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function(){
    console.log("Server started successfully")
})

