const expect = require('chai').expect;

const connectToDBs = require('../../../src/services/connectors/connector-factory');
const importModels = require('../../../src/models');

let  userRepository;
let createIdParamValidator;

let success = true;

const request = {};
const response = {};
const id = 2;

function next(error) {
    if (error) {
        success = false;
    }
}

describe('user repository', () => {
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
        userRepository = require('../../../src/repositories/users')(connector);
    });


    it('Should check if id exist in db', async () => {
        userRepository.createUser()
        connector.close();
        // expect(success).to.equal(true);
    });
});
