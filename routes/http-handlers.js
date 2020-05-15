const { Router } = require('express');
const config = require('config');

const User = require('../models/User');

const userResponses = require('./userResponses');
const httpFaceParametres = require('../azure/http-faceParametres'),
      httpCompare2Faces = require('../azure/http-compare2Faces'),
      httpFaceId = require('../azure/http-faceId');

const router = Router();

router.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html'); 
});

router.options('/*', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS'); // -PUT
    res.header('Access-Control-Allow-Headers',
    'Content-Type, Authorization, Content-Length, X-Requested-With'); // -Autorization
    res.send(200);
});

router.post('/faceParametres', async (req, res) => {
    try {
        const data = await httpFaceParametres(req.body);
        if (!data.length) throw new Error(`Wrong image: face cannot be found.`);

        res.status(200).json(data);

    } catch (e) {
        if (e.message == `Wrong image: face cannot be found.`) {
            res.status(400).json(userResponses.clientError(e.message));
            return;
        }
        console.log(e);
        res.status(500).json(userResponses.commonServerError);
    }
});

router.post(['/add-user',
    '/add-user/modified=false',
    '/add-user/modified=true'
], async (req, res) => {
    try {
        let { name, updateName, accessLevel, imageData, description } = req.body;
        if (!name || !accessLevel || !imageData) throw new Error('Invalid user data.');

        name = !!name ? String(name).trim().toLowerCase() : null;
        updateName = !!updateName ? String(updateName).trim().toLowerCase() : null;
        accessLevel = !!Number(accessLevel) ? Number(accessLevel) : 1;
        
        //# convert back to Uint8Array [array buffer]
        //# set length of the object to make it ITERABLE
        imageData.length = Object.keys(imageData).length;
        const bufferImage = Buffer.from(imageData);

        const candidate = await User.findOne({ name });
        if (candidate) updateUser();
            else addNewUser();
                throw new Error(`return...`);

        async function updateUser() {
            try {
                if (req.originalUrl == '/add-user/modified=true' ||
                    req.originalUrl == '/add-user/modified=true/') {

                    const faceParametres = await httpFaceParametres(bufferImage);
                    if (!faceParametres.length) throw new Error(`Invalid user data.`);
                    const [{ faceId }] = faceParametres;
                    //  if(!faceId) throw new Error('Invalid user data.');
                    
                    if (updateName) {
                        await User.findOneAndUpdate({ name }, {
                            name: updateName,
                            accessLevel,
                            // imageData,
                            // faceId, faceParametres,
                            description
                        });
                    } else {
                        await User.findOneAndUpdate({ name }, {
                            accessLevel,
                            imageData,
                            faceId, faceParametres,
                            description
                        });
                    }
                    
                    res.status(400).json(userResponses.userHasBeenModified);
                } else res.status(400).json(userResponses.userWithTheSameName);
            } catch (e) {
                if (e.message == `Invalid user data.`) {
                    console.log(e.message);
                    res.status(400).json(userResponses.clientError(e.message));
                    return;
                }
                console.log(e.message);
                res.status(500).json(userResponses.commonServerError);
            }
        }

        async function addNewUser() {
            try {
                const faceParametres = await httpFaceParametres(bufferImage);
                if (!faceParametres.length) throw new Error(`Invalid user data.`);
                const [{ faceId }] = faceParametres;
                // if(!faceId) throw new Error('Invalid user data.');

                const user = new User({
                    name,
                    accessLevel,
                    imageData,
                    faceId, faceParametres,
                    description
                });
                await user.save();
                res.status(201).json(userResponses.clientMessage(`User "${user.name}" has been added.`));
            } catch(e) {
                if (e.message == `Invalid user data.`) {
                    console.log(e.message);
                    res.status(400).json(userResponses.clientError(e.message));
                    return;
                }
                console.log(e.message);
                res.status(500).json(userResponses.commonServerError);
            }
        }

    } catch (e) {
        if (e.message == `return...`) return;
        if (e.message == `Invalid user data.`) {
            console.log(e.message);
            res.status(400).json(userResponses.clientError(e.message));
            return;
        }
        console.log(e);
        res.status(500).json(userResponses.commonServerError);
    }
});

router.post(['/find-one', '/find-all'], async (req, res) => {
    try {
        const response_httpFaceId = await httpFaceId(req.body);
        if (!response_httpFaceId.length) throw new Error(`Wrong image: face cannot be found.`);

        const [{ faceId }] = response_httpFaceId;

        const faceIDsArray = [],
            users = await User.find({});
        users.forEach(user => {
            faceIDsArray.push(user.faceId);
        });

        const sameUsers = [];
        while (faceIDsArray.length) {
            const lastElement = faceIDsArray.pop();
            const response = await httpCompare2Faces([String(faceId), String(lastElement)]);
            if (response.isIdentical === true) {
                const user = await User.findOne({ faceId: String(lastElement) });
                if (req.originalUrl.match(/^(\/find-all(|\/){1})$/)) {
                    const index = !!sameUsers.length ? sameUsers.length - 1 : 0;
                    sameUsers.push({ [index] : {
                        name: user.name,
                        accessLevel: user.accessLevel,
                        // faceParametres: user.faceParametres,
                        description: !!String(user.description).trim() ?
                            String(user.description).trim() : 'null'
                        }
                    });
                } else {
                    res.status(200).json({
                        message: {
                            code: `Successful`,
                            isUserInDataBase: true,
                            user: {
                                name: user.name,
                                accessLevel: user.accessLevel,
                                faceParametres: user.faceParametres,
                                description: !!String(user.description).trim() ?
                                    String(user.description).trim() : 'null'
                            }
                        }
                    });

                    // res.status(200).json({
                    //     message: {
                    //         code: `Successful`,
                    //         isUserInDataBase: true,
                            // userObject: {
                            //     name: user.name,
                            //     accessLevel: user.accessLevel,
                            //     faceParametres: user.faceParametres,
                            //     description: !!String(user.description).trim() ?
                            //         String(user.description).trim() : 'null'
                            // }
                    //     }
                    // });
    
                    throw new Error('return...');
                } 
            }
        }

        if (sameUsers.length) {
            res.status(200).json({
                message: {
                    code: `Successful`,
                    isUserInDataBase: true,
                    sameUsers
                }
            });
        } else {
            res.status(200).json(userResponses.noSuchUserInDataBase);
        } 

    } catch (e) {
        if (e.message == `return...`) return;
        if (e.message == `Wrong image: face cannot be found.`) {
            res.status(400).json(userResponses.clientError(e.message));
            return;
        }
        res.status(500).json(userResponses.commonServerError);
    }
});

router.get(['/return-collection', // <-- get full collection
    '/return-collection/:name',
    '/return-collection/name/:name',
    '/return-collection/faceId/:faceId',
    '/return-collection/accessLevel/:accessLevel',
], async (req, res) => {
    try {
        let { name, faceId, accessLevel } = req.params;

        if (name) sendUserByName(name);
        if (faceId) sendUserByFaceId(faceId)
        if (accessLevel) sendCollectionByAccessLevel(accessLevel);
        if (/^\/return-collection(|\/)$/.test(req.originalUrl)) sendFullCollection();

        throw new Error('return...');
        
        async function sendUserByName(name) {
            name = !!name ? String(name).trim().toLowerCase() : null;
            const candidate = await User.findOne({ name });
            if (candidate) {
                res.status(200).json({
                    message: {
                        code: `User has been found by name: ${name}.`,
                        userObject: {
                            name: candidate.name,
                            accessLevel: candidate.accessLevel,
                            imageData: candidate.imageData,
                            faceParametres: candidate.faceParametres,
                            description: !!String(candidate.description).trim() ?
                                String(candidate.description).trim() : 'null'
                        }
                    }
                });
            } else {
                res.status(400).json(userResponses.clientError(`No user with with name: ${name}.`));
            }

        }

        async function sendUserByFaceId(faceId) {
            faceId = !!faceId ? String(faceId).trim().toLowerCase() : null;
            const candidate = await User.findOne({ faceId });
            if (candidate) {
                res.status(200).json({
                    message: {
                        code: `User has been found by faceId: ${faceId}.`,
                        userObject: {
                            name: candidate.name,
                            accessLevel: candidate.accessLevel,
                            imageData: candidate.imageData,
                            faceParametres: candidate.faceParametres,
                            description: !!String(candidate.description).trim() ?
                                String(candidate.description).trim() : 'null'
                        }
                    }
                });
            } else {
                res.status(400).json(userResponses.clientError(`No user with "${faceId}" faceId.`));
            }
        }

        async function sendCollectionByAccessLevel(accessLevel) {
            accessLevel = !!Number(accessLevel) ? Number(accessLevel) : 1;
            const candidates = await User.exists({ accessLevel });
            if (candidates) {
                User.find({ accessLevel }).lean().exec((err, users) => {
                    return res.status(200).json({
                        message: {
                            code: `Return all elements with accessLevel: ${accessLevel}.`,
                            usersCollection: users
                        }
                    });
                });
            } else {
                res.status(400).json(userResponses.clientError(`No user with "${name}" faceId.`));
            }
        }

        async function sendFullCollection() {
            const candidates = await User.exists();
            if (candidates) {
                User.find().lean().exec((err, users) => {
                    return res.status(200).json({
                        message: {
                            code: `Return all elements of collection`,
                            usersCollection: users
                        }
                    });
                });
            } else {
                res.status(400).json(userResponses.clientError(`No collection.`));
            }
        }

    } catch (e) {
        if (e.message == `return...`) return;
        console.log(e);
        res.status(500).json(userResponses.commonServerError);
    }

});

router.get('/delete/:name/:password', deleteOne);
router.delete('/delete/:name/:password', deleteOne);

router.get('/delete-all/:password', deleteAll);
router.delete('/delete-all/:password', deleteAll);

async function deleteOne(req, res) {
    try {
        const { name, password } = req.params;
        if (password != config.get('confirmDelete')) {
            res.status(400).json(userResponses.clientError(`Wrong confirmation query.`))
            throw new Error(`return...`);
        } 
        
        const candidate = await User.exists({ name });
        if (!candidate) {
            res.status(400).json(userResponses.clientError(`No such user.`));
            throw new Error(`return...`);
        } 
        await User.findOneAndDelete({ name });
        res.status(200).json(userResponses.userHasBeenDeleted);

    
    } catch (e) {
        if (e.message == `return...`) return;
        console.log(e);
        res.status(500).json(userResponses.commonServerError);
    }
}

async function deleteAll(req, res) {
    try {
        const { password } = req.params;
        if (password != config.get('confirmDeleteAll')) {
            res.status(400).json(userResponses.clientError(`Wrong confirmation query.`))
            throw new Error(`return...`);
        } 
        
    await User.deleteMany({});
    res.status(500).json(userResponses.clientMessage('All users has been deleted...'));
    
    } catch (e) {
        if (e.message == `return...`) return;
        console.log(e);
        res.status(500).json(userResponses.commonServerError);
    }
}

module.exports = router;