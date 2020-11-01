import { JSWeb3APIDefinition} from '../lib/definitions';
import * as fs from 'fs';
import { TesterJSModule } from '../jsModules/Tester/tester';
import gql from 'graphql-tag';
import { EthereumJSModule } from '../jsModules/Ethereum/ethereum';

describe("JS Web3API Modules", () => {

    const testerSchema = fs.readFileSync('./src/jsModules/Tester/schema.graphql').toString();

    it("can call a tester JS Web3 API", async () => {
        const def = new JSWeb3APIDefinition(testerSchema, () => {
            return TesterJSModule();
        });

        const keyToSet = 'hello';
        const expectedValue = 'world';

        const api = await def.create();
        const setQuery = gql`mutation {
            setValue(key: "${keyToSet}", value: "${expectedValue}")
        }`;
        
        let res = await api.query({query: setQuery});

        expect(res.data?.setValue).toStrictEqual(true);

        const getQuery = gql`query {
            getValue(key: "${keyToSet}")
        }`;
        
        res = await api.query({query: getQuery});

        expect(res.data?.getValue).toStrictEqual(expectedValue);
    });

    const ethereumSchema = fs.readFileSync('./src/jsModules/Ethereum/schema.graphql').toString();

    it("can call the Ethereum JS Web3 API", async () => {
        const rpcEndPoint = "http://localhost:8545"
        const def = new JSWeb3APIDefinition(ethereumSchema, () => {
            return EthereumJSModule({provider: rpcEndPoint});
        });

        const simpleStorageContract: any = JSON.parse(fs.readFileSync('./src/__tests__/contracts/SimpleStorage.json').toString());

        const api = await def.create();

        const contractABI = JSON.stringify(simpleStorageContract.abi);
        const contractByteCode = simpleStorageContract.bytecode.object;

        let res: any;

        res = await api.query({
            query: 
                gql`mutation {
                    deployContract(abi: $var1, bytecode: $var2)
                }`,
            variables: {
                "var1": contractABI,
                "var2": contractByteCode
            }
        });

        console.log(res);
    });

});