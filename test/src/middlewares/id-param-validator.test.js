const expect = require('chai').expect;

const connectToDBs = require('../../../src/services/connectors/connector-factory');
const importModels = require('../../../src/models');

let  userRepository;
let createIdParamValidator;

let success = true;

const request = {};
const response = {};
const id = 1;

function next(error) {
    if (error) {
        success = false;
    }
}

describe('id-param-validator', () => {
    let connector;
    before(async () => {
        connectToDBs()
            .then(async sqlConnector => {
                importModels(sqlConnector);
                connector = sqlConnector;
            })
            .catch(next);
    });

    afterEach(async () => {

    });

    it('Should check if id exist in db', async () => {
        userRepository = require('../../../src/repositories/users')(connector);
        createIdParamValidator = require('../../../src/middlewares/id-param-validator')(userRepository);
        await createIdParamValidator(request, response, next, id);
        connector.close();
        expect(success).to.equal(true);
    });
});
