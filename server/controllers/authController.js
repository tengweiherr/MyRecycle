import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const signup = (req, res, next) => {
    //checks if email already exists
    User.findOne({ where : {
        email: req.body.email, 
    }})
    .then(dbUser => {
        if (dbUser) {
            return res.status(409).json({message: "email already exists"});
        } else if (req.body.email && req.body.password) {
            // password hash
            bcrypt.hash(req.body.password, 12, (err, passwordHash) => {
                if (err) {
                    return res.status(500).json({message: "couldnt hash the password"}); 
                } else if (passwordHash) {
                    return User.create(({
                        email: req.body.email,
                        name: req.body.name,
                        password: passwordHash,
                        role: req.body.role,
                        mr_points: 0,
                        state: req.body.state
                    }))
                    .then(response => {
                        const token = jwt.sign({ email: response.dataValues.email }, 'secret', { expiresIn: '1h' });
                        res.status(200).json({message: "user created", "token": token, "email": response.dataValues.email, "name": response.dataValues.name, "id": response.dataValues.id, "mr_points": 0});
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(502).json({message: "error while creating the user"});
                    });
                };
            });



        } else if (!req.body.password) {
            return res.status(400).json({message: "password not provided"});
        } else if (!req.body.email) {
            return res.status(400).json({message: "email not provided"});
        };
    })
    .catch(err => {
        console.log('error', err);
    });
};

const login = (req, res, next) => {

    let target = req.body.role.split(",");

    // checks if email exists
    User.findOne({ where : {
        email: req.body.email, 
        role: [target],
    }})
    .then(dbUser => {
        if (!dbUser) {
            return res.status(404).json({message: "user not found"});
        } else {
            // password hash
            bcrypt.compare(req.body.password, dbUser.password, (err, compareRes) => {
                if (err) { // error while comparing
                    res.status(502).json({message: "error while checking user password"});
                } else if (compareRes) { // password match
                    const token = jwt.sign({ email: req.body.email }, 'secret', { expiresIn: '1h' });
                    res.status(200).json({message: "user logged in", "token": token, "email": dbUser.email, "name": dbUser.name, "id": dbUser.id, "mr_points": dbUser.mr_points, "role": dbUser.role, "state": dbUser.state, "last_played": dbUser.last_played});
                } else { // password doesnt match
                    res.status(401).json({message: "invalid credentials"});
                };
            });
        };
    })
    .catch(err => {
        console.log('error', err);
    });
};

//issue if token is null

const isAuth = (req, res, next) => {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
        return res.status(401).json({ message: 'not authenticated' });
    };
    const token = authHeader.split(' ')[1];
    let decodedToken; 
    try {
        decodedToken = jwt.verify(token, 'secret');
    } catch (err) {
        return res.status(500).json({ message: err.message || 'could not decode the token' });
    };
    if (!decodedToken) {
        res.status(401).json({ message: 'unauthorized' });
    } else {
        res.status(200).json({ message: 'here is your resource' });
    };
};

const updateUserById = (req, res, next) => {

    bcrypt.hash(req.body.password, 12, (err, passwordHash) => {
        if (err) {
            return res.status(500).json({message: "couldnt hash the password"}); 
        } else if (passwordHash) {
            return User.update({
                email: req.body.email,
                name: req.body.name,
                password: passwordHash,
                role: req.body.role,
            }, {returning:true, where: {id:req.params.id}})
            .then(data => {
                console.log(JSON.stringify(data));
                res.send(JSON.stringify(data));        
            })
            .catch(err => {
                res.status(500).send({
                    message:
                      err.message || "Some error occurred while retrieving users."
                  });
            });
        };
    });

};

export { signup, login, isAuth, updateUserById };