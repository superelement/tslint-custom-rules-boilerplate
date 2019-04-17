import {getFixedResult, helper} from './lintRunner';
import {Rule} from './myCustomRule';

const rule = 'enforce-super-on-ng-destroy';

describe('enforceSuperOnNgDestroyRule', () => {
    it(`testing pass example`, () => {
        const src = `class MyClass extends BaseClass { ngOnDestroy() { super.ngOnDestroy(); } }`;
        const result = helper({src, rule});
        expect(result.errorCount).toBe(0);
    });

    it(`testing failure example`, () => {
        const src = `class MyClass extends BaseClass { ngOnDestroy() {} }`;
        const result = helper({src, rule});
        expect(result.errorCount).toBe(1);
    });

    xit('testing fixer example', () => {
        const src = `class MyClass extends BaseClass { ngOnDestroy() {} };`;
        const output = `class MyClass extends BaseClass { ngOnDestroy() {\nsuper.ngOnDestroy();\n} }`;

        const result = helper({src, rule});
        expect(result.errorCount).toBe(1);
        expect(getFixedResult({src, rule})).toEqual(output);
    });
});
