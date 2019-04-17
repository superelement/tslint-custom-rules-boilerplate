import * as Lint from 'tslint';
import * as ts from 'typescript';

export class Rule extends Lint.Rules.AbstractRule {
    static FAILURE_STRING = 'ngDestroy must call super().';

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new Walk(sourceFile, this.getOptions()));
    }
}

class Walk extends Lint.RuleWalker {
    protected visitClassDeclaration(node: ts.ClassDeclaration) {
        const content = node.getSourceFile().text;
        const METHOD_NAME = 'ngOnDestroy';

        const indexOfMethod = content.indexOf(METHOD_NAME);
        if (indexOfMethod !== -1) {
            const methodContent = content.substr(indexOfMethod, content.indexOf('}'));
            if (methodContent.indexOf('super.ngOnDestroy') === -1) {
                this.addFailureAt(indexOfMethod, methodContent.indexOf('}'), Rule.FAILURE_STRING, this.fix(methodContent.indexOf('{')));
            }
        }
        super.visitClassDeclaration(node);
    }

    private fix(indexOfOpenCurly: number): Lint.Fix {
        return new Lint.Replacement(indexOfOpenCurly + 1, indexOfOpenCurly + 2, '\nsuper.ngOnDestroy();\n')
    }
}

