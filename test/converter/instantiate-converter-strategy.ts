import {InstantiateConverterStrategy} from '../../lib/converter/instantiate-converter-strategy';
import { expect } from 'chai';

describe('InstantiateConverterStrategy', () => {
   let strategy: InstantiateConverterStrategy = null;

   beforeEach(() => {
       strategy = new InstantiateConverterStrategy();
   });

   describe('#getPriority()', () => {
       it('should return 1', () => {
           expect(strategy.getPriority()).to.equal(1);
       });
   });
});