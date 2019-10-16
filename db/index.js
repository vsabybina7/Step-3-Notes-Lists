const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const {uri,db}= require('./config');

const addNote = async id => {
    const client = new MongoClient(uri, { useNewUrlParser: true });
    await client.connect();
    const usersCollection = await client.db(db).collection("notes");
    await usersCollection.insertOne(id);
    console.log("1 document inserted");
    client.close();
};
const getNotes  = async () => {
    const client = new MongoClient(uri, { useNewUrlParser: true });
    await client.connect();
    const usersCollection = await client.db(db).collection("notes");
    const data = await usersCollection.find({}).toArray();
    client.close();
    return data;
};

const editNote = async (data, id) => {
    try {
        const client = new MongoClient(uri, { useNewUrlParser: true });
        await client.connect();
        const usersCollection = await client.db(db).collection("notes");
        id = await ObjectId(id);
        await usersCollection.updateOne({_id: id},
            {$set: {Title: data.Title, Content: data.Content}});
        console.log(`Document with ${id} is edited`);
        client.close();
    }catch (e) {
    }
};

const editList = async (data, id) => {
    try {
        const client = new MongoClient(uri, { useNewUrlParser: true });
        await client.connect();
        const usersCollection = await client.db(db).collection("lists");
        id = await ObjectId(id);
        await usersCollection.replaceOne({_id: id},data);
        console.log(`Todo list with ${id} is edited`);
        client.close();
    }catch (e) {
    }
};

const showNoteData = async id => {
    let info = {};
    try {
        const client = new MongoClient(uri, {useNewUrlParser: true});
        await client.connect();
        const data = await getNotes();
        const title = await data.find(item => item['_id'] == id)['Title'].toString();
        const content = await data.find(item => item['_id'] == id)['Content'].toString();
        info = {
            Title: title,
            Content: content
        };
        client.close();
    } catch (e) {
        console.log(e)
    }
    return info;
};

const showListData = async id => {
    let info = {};
    try {
        const client = new MongoClient(uri, {useNewUrlParser: true});
        await client.connect();
        const data = await getLists();
        const title = await data.find(item => item['_id'] == id)['Title'].toString();
        const tasks = await data.find(item => item['_id'] == id);
        info = {
            Title: title,
            tasks
        };
        client.close();

    } catch (e) {
        console.log(e)
    }
    return info;
};

const deleteNote = async id => {
    try {
        const client = new MongoClient(uri, {useNewUrlParser: true});
        await client.connect();
        const usersCollection = await client.db(db).collection("notes");
        const data = await getNotes();
        const title = await data.find(item => item['_id'] == id)['Title'].toString();
        const content = await data.find(item => item['_id'] == id)['Content'].toString();
        await usersCollection.deleteOne({Title: title, Content: content});
        client.close();
    }catch (e) {
        alert(e)
    }
};

const addList = async user => {
    const client = new MongoClient(uri, { useNewUrlParser: true });
    await client.connect();
    const usersCollection = await client.db(db).collection("lists");
    await usersCollection.insertOne(user);
    console.log("1 document inserted");
    client.close();
};
const getLists  = async () => {
    const client = new MongoClient(uri, { useNewUrlParser: true });
    await client.connect();
    const usersCollection = await client.db(db).collection("lists");
    const data = await usersCollection.find({}).toArray();
    client.close();
    return data;
};

const deleteList = async id => {
    const client = new MongoClient(uri, { useNewUrlParser: true });
    await client.connect();
    const usersCollection = await client.db(db).collection("lists");
    const data = await getLists();
    const list = await data.find(item=>item['_id']==id);
    await usersCollection.deleteOne(list);
    console.log('success');
    client.close();
};
const updateCheckListItem = async (id,param)  => {
    const client = new MongoClient(uri, { useNewUrlParser: true });
    await client.connect();
    const usersCollection = await client.db(db).collection("lists");
    const data = await getLists();
    const list = await  data.find(item=>item['_id']==id);
    if(await param[0]==="+"){
        await usersCollection.updateMany( list, { $rename: { [`${param}`]: `${param.split('+')[1]}` } } );
    }else{
        await usersCollection.updateMany( list, { $rename: { [`${param}`]: `+${param}` } } );
    }
    console.log(id + " " + param);
    client.close();
};

module.exports = {
    addList,
    addNote,
    getLists,
    getNotes,
    deleteList,
    deleteNote,
    showNoteData,
    showListData,
    editNote,
    editList,
    updateCheckListItem
};

