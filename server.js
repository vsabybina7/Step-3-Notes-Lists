const express = require('express');
const app = express();
const db = require('./db/');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json());

app.set('view engine','ejs');

app.get('/', async (req,res)=>{
    const notes = await db.getNotes();
    const lists = await db.getLists();
    res.render('pages/index',{
        notes,
        lists
    });
});

app.get('/notes/create',(req,res)=>{
    res.render('pages/notes/create');
});

app.get('/lists/create',(req,res)=>{
    res.render('pages/lists/create');
});

app.get('/notes/:id', async (req,res)=>{
    try {
        const data = await db.showNoteData(req.params.id);
        res.render('pages/notes/edit', {
            id: req.params.id,
            title: data.Title,
            content: data.Content
        });
    } catch (e) {
        console.log(e);
    }
});

app.get('/lists/:id', async (req,res)=>{
    try {
        const data = await db.showListData(req.params.id);
        res.render('pages/lists/edit', {
            id: req.params.id,
            title: data.Title,
            tasks: data.tasks
        });
    } catch (e) {
        console.log(e);
    }
});

app.delete('/api/notes/:id', async (req,res)=>{
    await db.deleteNote(req.params.id);
    res.send("id");
});

app.delete('/api/lists/:id', async (req,res)=>{
    await db.deleteList(req.params.id);
    res.send("id");
});

app.post('/notes/create',(req,res)=>{
    db.addNote(req.body);
    res.json(req.body.request == "true")
});

app.post('/lists/create',(req,res)=>{
    db.addList(req.body);
    res.json(req.body.request == "true")
});

app.post('/lists/update/:id', async (req,res)=>{
    await db.updateCheckListItem(req.params.id,req.body.data);
});

app.put('/api/notes/:id', async (req,res)=>{
    await db.editNote(req.body, req.params.id);
    res.json(req.body.request == "true")
});
app.put('/api/lists/:id', async (req,res)=>{
    await db.editList(req.body, req.params.id);
    res.json(req.body.request == "true")
});

app.set('port', (process.env.PORT || 3000));


app.listen(app.get('port'), function(){
    console.log('Port is' + app.get('port'));
});

console.log('everything is OK');