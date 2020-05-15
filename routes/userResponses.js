const userResponses = {
    
    userHasBeenDeleted: {
        message: {
            code: `User has been deleted...`,
        }
    },

    userHasBeenModified: {
        message: {
            code: `User has been modified...`,
        }
    },

    userWithTheSameName: {
        error: { 
            code: `Client error`, 
            message: `There is user with the same name.`
        } 
    }, 

    noSuchUserInDataBase: {
        message: {
            code: `Unsuccessful`,
            isUserInDataBase: false,
            faceParametres: null
        }
    },

    commonServerError: {
        error: { 
            code: `Server error?`, 
            message: `Oops... Something went wrong.`, 
        } 
    },

    clientError(message) {
        return ({
            error: { 
                code: `Client error`, 
                message 
            } 
        });
    },

    clientMessage(message) {
        return ({
            message: { 
                code: message, 
            } 
        });
    },
    
};

module.exports = userResponses 