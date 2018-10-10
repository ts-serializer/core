import {expect} from 'chai';
import {Converter} from '../../lib/converter/converter';
import {InstantiateConverterStrategy} from '../../lib/converter/instantiate-converter-strategy';

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

    describe('#canUseFor()', () => {
        it('should return always true', () => {
            expect(strategy.canUseFor(null)).to.equal(true);
        });
    });

    describe('#getConverter()', () => {
        it('should instantiate the type', () => {
            class Test implements Converter<string, string> {
                public fromJson(value: string): string { return ''; }

                public toJson(value: string): string { return ''; }
            }

            expect(strategy.getConverter(Test) instanceof Test).to.equal(true);
        });
    });
});
