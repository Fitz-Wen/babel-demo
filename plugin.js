/**
 * babelTypes: 是一个用于 AST 节点的工具库,包含了构造、验证以及变换 AST 节点的方法。
 * path: 代表了两个节点之间的关联
 * state: 代表了插件的状态，可通过state来访问插件的配置项。
 * visitor: Babel采取递归的方式访问AST的每个节点
 * Identifier、ASTNodeTypeHere: AST的每个节点，都有对应的节点类型，
 * 比如标识符（Identifier）、函数声明（FunctionDeclaration）等，可以在visitor上声明同名的属性，
 * 当Babel遍历到相应类型的节点，属性对应的方法就会被调用，传入的参数就是path、state
 */
const types = require('@babel/types');
module.exports = function({ types: babelTypes }) {
  return {
    name: "deadly-simple-plugin-example",
    visitor: {
      // 传入参数，改变代码
      Identifier(path, state) {
        let name = path.node.name;
        if (state.opts[name]) {
          path.node.name = state.opts[name];
        }
      },
      // 将==变更为===
      BinaryExpression(path, state) {
        const node = path.node;
        if (node.operator === '==') {
          node.operator = '===';
        }
      },
      // 将var变更为let
      VariableDeclaration(path) {
        const node = path.node;
        if (node.kind === 'var') { 
          node.kind = 'let';
        } 
      },
      // 箭头函数转换
      ArrowFunctionExpression(path, state) {
        let params = path.node.params;
        let blockStatement = types.blockStatement([types.returnStatement(path.node.body)])
        let func = types.functionExpression(null, params, blockStatement, false,false);
        path.replaceWith(func)
      }
    }
  };
};