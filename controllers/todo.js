// create a reference to the model
let TodoModel = require('../models/todo');

// Gets all todo from the Database and renders the page to list them all.
module.exports.todoList = function(req, res, next) {  

    TodoModel.find((err, todoList) => {
        //console.log(todoList);
        if(err)
        {
            return console.error(err);
        }
        else
        {
            res.render('todo/list', {
                title: 'To-Do List', 
                TodoList: todoList,
                userName: req.user ? req.user.username : ''
            })            
        }
    });
}


// Gets a todo by id and renders the details page.
module.exports.details = (req, res, next) => {
    
    let id = req.params.id;

    TodoModel.findById(id, (err, todoToShow) => {
        if(err)
        {
            console.log(err);
            res.end(err);
        }
        else
        {
            //show the edit view
            res.render('todo/details', {
                title: 'To-Do Details', 
                todo: todoToShow
            })
        }
    });
}

// Gets a todo by id and renders the Edit form using the add_edit.ejs template
module.exports.displayEditPage = (req, res, next) => {
    
    // ADD YOUR CODE HERE
    // if not error we render add_edit page and pass Edit as title and todoEdit as the to do to be edited

    let id = req.params.id

    TodoModel.findById(id, (err, todoToEdit) => {
        if(err)
        {
            console.log(err);
            res.end(err);
        }
        else
        {
            //show the edit view
            res.render('todo/add_edit', {
                title: 'Edit', 
                todo: todoToEdit
            })
        }
    });


}

// Processes the data submitted from the Edit form to update a todo
module.exports.processEditPage = async (req, res, next) => {

    let id = req.params.id
    
    console.log(req.body);

    let updatedTodo = TodoModel({
        _id: req.body.id,
        task: req.body.task,
        description: req.body.description,
        complete: req.body.complete ? true : false
    });

    // ADD YOUR CODE HERE
    //we use filter to store the id which will be used as the first parameter  in findOneAndUpdate to find the ToDo to edit. 
    //As second parameter we pass the updatedTodo to save the edited to do in the database
    const filter = { _id: req.body.id}
    const editToDo = await TodoModel.findOneAndUpdate(filter,updatedTodo)
    
    res.redirect('/todo/list')

}

// Deletes a todo based on its id.
module.exports.performDelete = async (req, res, next) => {

    // ADD YOUR CODE HERE
    let id = req.params.id

    console.log("I came here")

    //we find the to do first using the id and then remove it
    const deleteTodo = await TodoModel.findById(id).findOneAndRemove()

    //we redirect user to to do list 
    res.redirect('/todo/list')


}

// Renders the Add form using the add_edit.ejs template
module.exports.displayAddPage = (req, res, next) => {

    // ADD YOUR CODE HERE 
    // we create blank to do to pass to add_edit
    let newTodo = TodoModel({
        _id: "",
        task: "",
        description: "",
        complete: false
    });

    // We load add_edit page with Add as title passed which will be later used in check function too
    res.render('todo/add_edit', { 
        title: 'Add',
        userName: req.user ? req.user.username : '',
        todo: newTodo
    });        

}

// Processes the data submitted from the Add form to create a new todo
module.exports.processAddPage = (req, res, next) => {

    console.log(req.body);

    let newTodo = TodoModel({
        //_id: req.body.id,
        task: req.body.task,
        description: req.body.description,
        complete: req.body.complete ? true : false
    });

    // ADD YOUR CODE HERE
    // we use mongoose .save() to save the new to do
    newTodo.save()
    .then ( todo => {
        console.log(newTodo)
        res.redirect('/todo/list')
    })
    .catch(err => console.log(err))
    
}