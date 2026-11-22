/* Categorized LaTeX Math Symbols catalog for GabeTeX Online Editor */
(function (root) {
  'use strict';

  var CATEGORIES = [
    {
      id: 'greekLower',
      labelKey: 'editor.symCat.greekLower',
      icon: 'α',
      symbols: [
        { display: 'α', code: '\\alpha', name: 'alpha', keywords: ['alfa'] },
        { display: 'β', code: '\\beta', name: 'beta' },
        { display: 'γ', code: '\\gamma', name: 'gamma', keywords: ['gama'] },
        { display: 'δ', code: '\\delta', name: 'delta' },
        { display: 'ϵ', code: '\\epsilon', name: 'epsilon', keywords: ['epsilo'] },
        { display: 'ε', code: '\\varepsilon', name: 'var epsilon', keywords: ['epsilon'] },
        { display: 'ζ', code: '\\zeta', name: 'zeta' },
        { display: 'η', code: '\\eta', name: 'eta' },
        { display: 'θ', code: '\\theta', name: 'theta', keywords: ['teta'] },
        { display: 'ϑ', code: '\\vartheta', name: 'var theta', keywords: ['teta'] },
        { display: 'ι', code: '\\iota', name: 'iota' },
        { display: 'κ', code: '\\kappa', name: 'kappa', keywords: ['capa'] },
        { display: 'ϰ', code: '\\varkappa', name: 'var kappa', pkg: 'amssymb' },
        { display: 'λ', code: '\\lambda', name: 'lambda' },
        { display: 'μ', code: '\\mu', name: 'mu' },
        { display: 'ν', code: '\\nu', name: 'nu' },
        { display: 'ξ', code: '\\xi', name: 'xi' },
        { display: 'π', code: '\\pi', name: 'pi' },
        { display: 'ϖ', code: '\\varpi', name: 'var pi' },
        { display: 'ρ', code: '\\rho', name: 'rho' },
        { display: 'ϱ', code: '\\varrho', name: 'var rho' },
        { display: 'σ', code: '\\sigma', name: 'sigma' },
        { display: 'ς', code: '\\varsigma', name: 'var sigma' },
        { display: 'τ', code: '\\tau', name: 'tau' },
        { display: 'υ', code: '\\upsilon', name: 'upsilon' },
        { display: 'ϕ', code: '\\phi', name: 'phi', keywords: ['fi'] },
        { display: 'φ', code: '\\varphi', name: 'var phi', keywords: ['fi'] },
        { display: 'χ', code: '\\chi', name: 'chi', keywords: ['qui'] },
        { display: 'ψ', code: '\\psi', name: 'psi' },
        { display: 'ω', code: '\\omega', name: 'omega' },
        { display: 'ϝ', code: '\\digamma', name: 'digamma', pkg: 'amssymb' }
      ]
    },
    {
      id: 'greekUpper',
      labelKey: 'editor.symCat.greekUpper',
      icon: 'Ω',
      symbols: [
        { display: 'Γ', code: '\\Gamma', name: 'Gamma' },
        { display: 'Δ', code: '\\Delta', name: 'Delta' },
        { display: 'Θ', code: '\\Theta', name: 'Theta' },
        { display: 'Λ', code: '\\Lambda', name: 'Lambda' },
        { display: 'Ξ', code: '\\Xi', name: 'Xi' },
        { display: 'Π', code: '\\Pi', name: 'Pi' },
        { display: 'Σ', code: '\\Sigma', name: 'Sigma' },
        { display: 'Υ', code: '\\Upsilon', name: 'Upsilon' },
        { display: 'Φ', code: '\\Phi', name: 'Phi' },
        { display: 'Ψ', code: '\\Psi', name: 'Psi' },
        { display: 'Ω', code: '\\Omega', name: 'Omega' },
        { display: '𝛤', code: '\\varGamma', name: 'varGamma (italic)', pkg: 'amsmath' },
        { display: '𝛥', code: '\\varDelta', name: 'varDelta (italic)', pkg: 'amsmath' },
        { display: '𝛩', code: '\\varTheta', name: 'varTheta (italic)', pkg: 'amsmath' },
        { display: '𝛬', code: '\\varLambda', name: 'varLambda (italic)', pkg: 'amsmath' },
        { display: '𝛯', code: '\\varXi', name: 'varXi (italic)', pkg: 'amsmath' },
        { display: '𝛱', code: '\\varPi', name: 'varPi (italic)', pkg: 'amsmath' },
        { display: '𝛴', code: '\\varSigma', name: 'varSigma (italic)', pkg: 'amsmath' },
        { display: '𝛶', code: '\\varUpsilon', name: 'varUpsilon (italic)', pkg: 'amsmath' },
        { display: '𝛷', code: '\\varPhi', name: 'varPhi (italic)', pkg: 'amsmath' },
        { display: '𝛹', code: '\\varPsi', name: 'varPsi (italic)', pkg: 'amsmath' },
        { display: '𝛺', code: '\\varOmega', name: 'varOmega (italic)', pkg: 'amsmath' }
      ]
    },
    {
      id: 'binaryOps',
      labelKey: 'editor.symCat.binaryOps',
      icon: '±',
      symbols: [
        { display: '±', code: '\\pm', name: 'plus-minus', keywords: ['mais ou menos'] },
        { display: '∓', code: '\\mp', name: 'minus-plus' },
        { display: '×', code: '\\times', name: 'times', keywords: ['multiply', 'multiplicação', 'produto'] },
        { display: '÷', code: '\\div', name: 'divide', keywords: ['divisão'] },
        { display: '⋅', code: '\\cdot', name: 'center dot', keywords: ['dot product', 'produto escalar'] },
        { display: '∗', code: '\\ast', name: 'asterisk', keywords: ['convolution'] },
        { display: '⋆', code: '\\star', name: 'star' },
        { display: '∘', code: '\\circ', name: 'composition circle', keywords: ['composta'] },
        { display: '•', code: '\\bullet', name: 'bullet' },
        { display: '⊕', code: '\\oplus', name: 'direct sum / xor', keywords: ['soma direta'] },
        { display: '⊖', code: '\\ominus', name: 'circled minus' },
        { display: '⊗', code: '\\otimes', name: 'tensor product', keywords: ['produto tensorial'] },
        { display: '⊘', code: '\\oslash', name: 'circled slash' },
        { display: '⊙', code: '\\odot', name: 'circled dot', keywords: ['hadamard'] },
        { display: '†', code: '\\dagger', name: 'dagger', keywords: ['adjoint', 'hermitian'] },
        { display: '‡', code: '\\ddagger', name: 'double dagger' },
        { display: '⨿', code: '\\amalg', name: 'amalgamation / coproduct' },
        { display: '◁', code: '\\triangleleft', name: 'triangle left' },
        { display: '▷', code: '\\triangleright', name: 'triangle right' },
        { display: '△', code: '\\bigtriangleup', name: 'big triangle up' },
        { display: '▽', code: '\\bigtriangledown', name: 'big triangle down' },
        { display: '≀', code: '\\wr', name: 'wreath product' },
        { display: '⋄', code: '\\diamond', name: 'diamond operator' },
        { display: '⊎', code: '\\uplus', name: 'multiset union' },
        { display: '⊓', code: '\\sqcap', name: 'square cap' },
        { display: '⊔', code: '\\sqcup', name: 'square cup' },
        { display: '∧', code: '\\wedge', name: 'wedge / exterior product' },
        { display: '∨', code: '\\vee', name: 'vee' },
        { display: '∖', code: '\\setminus', name: 'set difference', keywords: ['diferença de conjuntos'] },
        { display: '⊞', code: '\\boxplus', name: 'boxed plus', pkg: 'amssymb' },
        { display: '⊟', code: '\\boxminus', name: 'boxed minus', pkg: 'amssymb' },
        { display: '⊠', code: '\\boxtimes', name: 'boxed times', pkg: 'amssymb' },
        { display: '⊡', code: '\\boxdot', name: 'boxed dot', pkg: 'amssymb' },
        { display: '⋉', code: '\\ltimes', name: 'left semidirect product', pkg: 'amssymb' },
        { display: '⋊', code: '\\rtimes', name: 'right semidirect product', pkg: 'amssymb' },
        { display: '⊛', code: '\\circledast', name: 'circled asterisk', pkg: 'amssymb' },
        { display: '⊚', code: '\\circledcirc', name: 'circled ring', pkg: 'amssymb' },
        { display: '⊝', code: '\\circleddash', name: 'circled dash', pkg: 'amssymb' },
        { display: '∔', code: '\\dotplus', name: 'dot plus', pkg: 'amssymb' },
        { display: '⋇', code: '\\divideontimes', name: 'divide on times', pkg: 'amssymb' },
        { display: '⋅', code: '\\centerdot', name: 'centered dot', pkg: 'amssymb' },
        { display: '⊺', code: '\\intercal', name: 'intercalate / transpose', pkg: 'amssymb' },
        { display: '⊼', code: '\\barwedge', name: 'nand / barwedge', pkg: 'amssymb' },
        { display: '⊻', code: '\\veebar', name: 'xor / veebar', pkg: 'amssymb' },
        { display: '⩞', code: '\\doublebarwedge', name: 'double barwedge', pkg: 'amssymb' }
      ]
    },
    {
      id: 'relations',
      labelKey: 'editor.symCat.relations',
      icon: '≈',
      symbols: [
        { display: '=', code: '=', name: 'equals', keywords: ['igual'] },
        { display: '≠', code: '\\neq', name: 'not equal', keywords: ['diferente'] },
        { display: '≡', code: '\\equiv', name: 'equivalent / congruent', keywords: ['equivalente'] },
        { display: '≢', code: '\\not\\equiv', name: 'not equivalent' },
        { display: '<', code: '<', name: 'less than', keywords: ['menor'] },
        { display: '>', code: '>', name: 'greater than', keywords: ['maior'] },
        { display: '≤', code: '\\leq', name: 'less than or equal', keywords: ['menor ou igual'] },
        { display: '≥', code: '\\geq', name: 'greater than or equal', keywords: ['maior ou igual'] },
        { display: '⩽', code: '\\leqslant', name: 'slanted less or equal', pkg: 'amssymb' },
        { display: '⩾', code: '\\geqslant', name: 'slanted greater or equal', pkg: 'amssymb' },
        { display: '≪', code: '\\ll', name: 'much less than' },
        { display: '≫', code: '\\gg', name: 'much greater than' },
        { display: '⋘', code: '\\lll', name: 'very much less than', pkg: 'amssymb' },
        { display: '⋙', code: '\\ggg', name: 'very much greater than', pkg: 'amssymb' },
        { display: '≈', code: '\\approx', name: 'approximately equal', keywords: ['aproximado'] },
        { display: '≊', code: '\\approxeq', name: 'approx or equal', pkg: 'amssymb' },
        { display: '∼', code: '\\sim', name: 'similar / tilde' },
        { display: '≃', code: '\\simeq', name: 'asymptotically equal' },
        { display: '≅', code: '\\cong', name: 'congruent / isomorphic', keywords: ['isomorfo'] },
        { display: '≇', code: '\\ncong', name: 'not congruent', pkg: 'amssymb' },
        { display: '∝', code: '\\propto', name: 'proportional to', keywords: ['proporcional'] },
        { display: '≺', code: '\\prec', name: 'precedes' },
        { display: '≻', code: '\\succ', name: 'succeeds' },
        { display: '⪯', code: '\\preceq', name: 'precedes or equals' },
        { display: '⪰', code: '\\succeq', name: 'succeeds or equals' },
        { display: '≼', code: '\\preccurlyeq', name: 'precedes curly', pkg: 'amssymb' },
        { display: '≽', code: '\\succcurlyeq', name: 'succeeds curly', pkg: 'amssymb' },
        { display: '≲', code: '\\lesssim', name: 'less than or similar', pkg: 'amssymb' },
        { display: '≳', code: '\\gtrsim', name: 'greater than or similar', pkg: 'amssymb' },
        { display: '⪅', code: '\\lessapprox', name: 'less or approx', pkg: 'amssymb' },
        { display: '⪆', code: '\\gtrapprox', name: 'greater or approx', pkg: 'amssymb' },
        { display: '⊥', code: '\\perp', name: 'perpendicular / orthogonal', keywords: ['ortogonal'] },
        { display: '∥', code: '\\parallel', name: 'parallel', keywords: ['paralelo'] },
        { display: '∦', code: '\\nparallel', name: 'not parallel', pkg: 'amssymb' },
        { display: '∣', code: '\\mid', name: 'divides / mid' },
        { display: '∤', code: '\\nmid', name: 'does not divide', pkg: 'amssymb' },
        { display: '⋈', code: '\\bowtie', name: 'bowtie / natural join' },
        { display: '⨝', code: '\\Join', name: 'join', pkg: 'amssymb' },
        { display: '⊢', code: '\\vdash', name: 'turnstile / proves' },
        { display: '⊣', code: '\\dashv', name: 'reverse turnstile' },
        { display: '⊨', code: '\\models', name: 'models / satisfies' },
        { display: '⊧', code: '\\vDash', name: 'double turnstile', pkg: 'amssymb' },
        { display: '⊩', code: '\\Vdash', name: 'forces', pkg: 'amssymb' },
        { display: '⊬', code: '\\nvdash', name: 'does not prove', pkg: 'amssymb' },
        { display: '⊭', code: '\\nvDash', name: 'does not satisfy', pkg: 'amssymb' },
        { display: '≐', code: '\\doteq', name: 'approaches limit / dot equal' },
        { display: '≜', code: '\\triangleq', name: 'defined as (triangle equal)', pkg: 'amssymb' },
        { display: '≍', code: '\\asymp', name: 'asymptotic' },
        { display: '⌣', code: '\\smile', name: 'smile / cup product' },
        { display: '⌢', code: '\\frown', name: 'frown / cap product' },
        { display: '⊏', code: '\\sqsubset', name: 'square subset', pkg: 'amssymb' },
        { display: '⊐', code: '\\sqsupset', name: 'square superset', pkg: 'amssymb' },
        { display: '⊑', code: '\\sqsubseteq', name: 'square subset or equal' },
        { display: '⊒', code: '\\sqsupseteq', name: 'square superset or equal' }
      ]
    },
    {
      id: 'setsLogic',
      labelKey: 'editor.symCat.setsLogic',
      icon: '∀',
      symbols: [
        { display: '∈', code: '\\in', name: 'element of', keywords: ['pertence', 'conjunto'] },
        { display: '∉', code: '\\notin', name: 'not an element of', keywords: ['não pertence'] },
        { display: '∋', code: '\\ni', name: 'contains as member', keywords: ['contém'] },
        { display: '⊂', code: '\\subset', name: 'proper subset', keywords: ['subconjunto'] },
        { display: '⊃', code: '\\supset', name: 'proper superset' },
        { display: '⊆', code: '\\subseteq', name: 'subset or equal', keywords: ['subconjunto ou igual'] },
        { display: '⊇', code: '\\supseteq', name: 'superset or equal' },
        { display: '⊈', code: '\\nsubseteq', name: 'neither subset nor equal', pkg: 'amssymb' },
        { display: '⊉', code: '\\nsupseteq', name: 'neither superset nor equal', pkg: 'amssymb' },
        { display: '⊊', code: '\\subsetneq', name: 'subset not equal', pkg: 'amssymb' },
        { display: '⊋', code: '\\supsetneq', name: 'superset not equal', pkg: 'amssymb' },
        { display: '⊊', code: '\\varsubsetneq', name: 'var subset not equal', pkg: 'amssymb' },
        { display: '⊋', code: '\\varsupsetneq', name: 'var superset not equal', pkg: 'amssymb' },
        { display: '∩', code: '\\cap', name: 'intersection', keywords: ['interseção'] },
        { display: '∪', code: '\\cup', name: 'union', keywords: ['união'] },
        { display: '∖', code: '\\setminus', name: 'set difference' },
        { display: '∅', code: '\\emptyset', name: 'empty set', keywords: ['conjunto vazio'] },
        { display: '∅', code: '\\varnothing', name: 'var empty set', pkg: 'amssymb', keywords: ['vazio'] },
        { display: '∀', code: '\\forall', name: 'for all', keywords: ['para todo', 'universal'] },
        { display: '∃', code: '\\exists', name: 'there exists', keywords: ['existe', 'existencial'] },
        { display: '∄', code: '\\nexists', name: 'does not exist', pkg: 'amssymb', keywords: ['não existe'] },
        { display: '¬', code: '\\neg', name: 'logical not / negation', keywords: ['negação'] },
        { display: '∧', code: '\\land', name: 'logical and', keywords: ['e lógico', 'conjunção'] },
        { display: '∨', code: '\\lor', name: 'logical or', keywords: ['ou lógico', 'disjunção'] },
        { display: '⟹', code: '\\implies', name: 'implies', pkg: 'amsmath', keywords: ['implica'] },
        { display: '⟺', code: '\\iff', name: 'if and only if', pkg: 'amsmath', keywords: ['se e somente se'] },
        { display: '⊤', code: '\\top', name: 'top / tautology' },
        { display: '⊥', code: '\\bot', name: 'bottom / contradiction' },
        { display: '∵', code: '\\because', name: 'because', pkg: 'amssymb', keywords: ['porque'] },
        { display: '∴', code: '\\therefore', name: 'therefore', pkg: 'amssymb', keywords: ['portanto'] },
        { display: '∁', code: '\\complement', name: 'complement', pkg: 'amssymb', keywords: ['complemento'] },
        { display: '⋐', code: '\\Subset', name: 'double subset', pkg: 'amssymb' },
        { display: '⋑', code: '\\Supset', name: 'double superset', pkg: 'amssymb' },
        { display: 'ℵ', code: '\\aleph', name: 'aleph', keywords: ['cardinal'] },
        { display: 'ℶ', code: '\\beth', name: 'beth', pkg: 'amssymb' },
        { display: 'ℷ', code: '\\gimel', name: 'gimel', pkg: 'amssymb' },
        { display: 'ℸ', code: '\\daleth', name: 'daleth', pkg: 'amssymb' }
      ]
    },
    {
      id: 'arrows',
      labelKey: 'editor.symCat.arrows',
      icon: '→',
      symbols: [
        { display: '←', code: '\\leftarrow', name: 'left arrow', keywords: ['seta esquerda'] },
        { display: '→', code: '\\rightarrow', name: 'right arrow', keywords: ['seta direita', 'to'] },
        { display: '↔', code: '\\leftrightarrow', name: 'left-right arrow' },
        { display: '⇐', code: '\\Leftarrow', name: 'double left arrow' },
        { display: '⇒', code: '\\Rightarrow', name: 'double right arrow', keywords: ['implies'] },
        { display: '⇔', code: '\\Leftrightarrow', name: 'double left-right arrow', keywords: ['iff'] },
        { display: '⟵', code: '\\longleftarrow', name: 'long left arrow' },
        { display: '⟶', code: '\\longrightarrow', name: 'long right arrow' },
        { display: '⟷', code: '\\longleftrightarrow', name: 'long left-right arrow' },
        { display: '⟸', code: '\\Longleftarrow', name: 'long double left arrow' },
        { display: '⟹', code: '\\Longrightarrow', name: 'long double right arrow' },
        { display: '⟺', code: '\\Longleftrightarrow', name: 'long double left-right arrow' },
        { display: '↦', code: '\\mapsto', name: 'maps to', keywords: ['função', 'mapeia'] },
        { display: '⟼', code: '\\longmapsto', name: 'long maps to' },
        { display: '↑', code: '\\uparrow', name: 'up arrow' },
        { display: '↓', code: '\\downarrow', name: 'down arrow' },
        { display: '↕', code: '\\updownarrow', name: 'up-down arrow' },
        { display: '⇑', code: '\\Uparrow', name: 'double up arrow' },
        { display: '⇓', code: '\\Downarrow', name: 'double down arrow' },
        { display: '⇕', code: '\\Updownarrow', name: 'double up-down arrow' },
        { display: '↗', code: '\\nearrow', name: 'north-east arrow' },
        { display: '↘', code: '\\searrow', name: 'south-east arrow' },
        { display: '↙', code: '\\swarrow', name: 'south-west arrow' },
        { display: '↖', code: '\\nwarrow', name: 'north-west arrow' },
        { display: '↪', code: '\\hookrightarrow', name: 'hook right arrow', keywords: ['inclusion', 'injeção'] },
        { display: '↩', code: '\\hookleftarrow', name: 'hook left arrow' },
        { display: '↼', code: '\\leftharpoonup', name: 'left harpoon up' },
        { display: '↽', code: '\\leftharpoondown', name: 'left harpoon down' },
        { display: '⇀', code: '\\rightharpoonup', name: 'right harpoon up' },
        { display: '⇁', code: '\\rightharpoondown', name: 'right harpoon down' },
        { display: '⇌', code: '\\rightleftharpoons', name: 'equilibrium harpoons', keywords: ['equilíbrio'] },
        { display: '↠', code: '\\twoheadrightarrow', name: 'two-head right arrow', pkg: 'amssymb', keywords: ['surjection', 'sobrejeção'] },
        { display: '↞', code: '\\twoheadleftarrow', name: 'two-head left arrow', pkg: 'amssymb' },
        { display: '↣', code: '\\rightarrowtail', name: 'right arrow with tail', pkg: 'amssymb' },
        { display: '↢', code: '\\leftarrowtail', name: 'left arrow with tail', pkg: 'amssymb' },
        { display: '↬', code: '\\looparrowright', name: 'loop arrow right', pkg: 'amssymb' },
        { display: '↫', code: '\\looparrowleft', name: 'loop arrow left', pkg: 'amssymb' },
        { display: '↷', code: '\\curvearrowright', name: 'curve arrow right', pkg: 'amssymb' },
        { display: '↶', code: '\\curvearrowleft', name: 'curve arrow left', pkg: 'amssymb' },
        { display: '↻', code: '\\circlearrowright', name: 'clockwise circle arrow', pkg: 'amssymb' },
        { display: '↺', code: '\\circlearrowleft', name: 'counterclockwise circle arrow', pkg: 'amssymb' },
        { display: '↚', code: '\\nleftarrow', name: 'negated left arrow', pkg: 'amssymb' },
        { display: '↛', code: '\\nrightarrow', name: 'negated right arrow', pkg: 'amssymb' },
        { display: '⇍', code: '\\nLeftarrow', name: 'negated double left arrow', pkg: 'amssymb' },
        { display: '⇏', code: '\\nRightarrow', name: 'negated double right arrow', pkg: 'amssymb' },
        { display: '→̲', code: '\\xrightarrow{}', name: 'extensible right arrow', pkg: 'amsmath' },
        { display: '←̲', code: '\\xleftarrow{}', name: 'extensible left arrow', pkg: 'amsmath' }
      ]
    },
    {
      id: 'bigOps',
      labelKey: 'editor.symCat.bigOps',
      icon: '∑',
      symbols: [
        { display: '∑', code: '\\sum', name: 'summation', keywords: ['somatório', 'sigma'] },
        { display: '∏', code: '\\prod', name: 'product', keywords: ['produtório'] },
        { display: '∐', code: '\\coprod', name: 'coproduct', keywords: ['coproduto'] },
        { display: '∫', code: '\\int', name: 'integral' },
        { display: '∬', code: '\\iint', name: 'double integral', pkg: 'amsmath', keywords: ['integral dupla'] },
        { display: '∭', code: '\\iiint', name: 'triple integral', pkg: 'amsmath', keywords: ['integral tripla'] },
        { display: '⨌', code: '\\iiiint', name: 'quadruple integral', pkg: 'amsmath' },
        { display: '∫⋯∫', code: '\\idotsint', name: 'multiple integral with dots', pkg: 'amsmath' },
        { display: '∮', code: '\\oint', name: 'contour integral', keywords: ['integral de linha', 'fechada'] },
        { display: '⋃', code: '\\bigcup', name: 'n-ary union', keywords: ['união grande'] },
        { display: '⋂', code: '\\bigcap', name: 'n-ary intersection', keywords: ['interseção grande'] },
        { display: '⨆', code: '\\bigsqcup', name: 'n-ary square union' },
        { display: '⋁', code: '\\bigvee', name: 'n-ary logical or' },
        { display: '⋀', code: '\\bigwedge', name: 'n-ary logical and' },
        { display: '⨁', code: '\\bigoplus', name: 'n-ary direct sum' },
        { display: '⨂', code: '\\bigotimes', name: 'n-ary tensor product' },
        { display: '⨀', code: '\\bigodot', name: 'n-ary circled dot' },
        { display: '⨄', code: '\\biguplus', name: 'n-ary multiset union' },
        { display: '∂', code: '\\partial', name: 'partial derivative', keywords: ['derivada parcial'] },
        { display: '∇', code: '\\nabla', name: 'nabla / gradient', keywords: ['gradiente', 'del'] },
        { display: 'lim', code: '\\lim_{}', name: 'limit', keywords: ['limite'] },
        { display: 'lim sup', code: '\\limsup', name: 'limit superior' },
        { display: 'lim inf', code: '\\liminf', name: 'limit inferior' },
        { display: 'sup', code: '\\sup', name: 'supremum', keywords: ['supremo'] },
        { display: 'inf', code: '\\inf', name: 'infimum', keywords: ['ínfimo'] },
        { display: 'max', code: '\\max', name: 'maximum', keywords: ['máximo'] },
        { display: 'min', code: '\\min', name: 'minimum', keywords: ['mínimo'] },
        { display: 'd', code: '\\mathrm{d}', name: 'differential d', keywords: ['diferencial'] }
      ]
    },
    {
      id: 'delimiters',
      labelKey: 'editor.symCat.delimiters',
      icon: '⟨⟩',
      symbols: [
        { display: '(', code: '(', name: 'left parenthesis' },
        { display: ')', code: ')', name: 'right parenthesis' },
        { display: '[', code: '[', name: 'left bracket' },
        { display: ']', code: ']', name: 'right bracket' },
        { display: '{', code: '\\{', name: 'left brace', keywords: ['chave'] },
        { display: '}', code: '\\}', name: 'right brace', keywords: ['chave'] },
        { display: '⟨', code: '\\langle', name: 'left angle bracket', keywords: ['bra', 'inner product'] },
        { display: '⟩', code: '\\rangle', name: 'right angle bracket', keywords: ['ket', 'inner product'] },
        { display: '⌊', code: '\\lfloor', name: 'left floor', keywords: ['piso'] },
        { display: '⌋', code: '\\rfloor', name: 'right floor', keywords: ['piso'] },
        { display: '⌈', code: '\\lceil', name: 'left ceiling', keywords: ['teto'] },
        { display: '⌉', code: '\\rceil', name: 'right ceiling', keywords: ['teto'] },
        { display: '|', code: '\\lvert', name: 'left vertical bar', pkg: 'amsmath', keywords: ['abs'] },
        { display: '|', code: '\\rvert', name: 'right vertical bar', pkg: 'amsmath' },
        { display: '‖', code: '\\lVert', name: 'left double bar', pkg: 'amsmath', keywords: ['norm'] },
        { display: '‖', code: '\\rVert', name: 'right double bar', pkg: 'amsmath' },
        { display: '(⋯)', code: '\\left( {} \\right)', name: 'auto-sized parentheses' },
        { display: '[⋯]', code: '\\left[ {} \\right]', name: 'auto-sized brackets' },
        { display: '{⋯}', code: '\\left\\{ {} \\right\\}', name: 'auto-sized braces' },
        { display: '|⋯|', code: '\\left| {} \\right|', name: 'auto-sized absolute value' },
        { display: '‖⋯‖', code: '\\left\\| {} \\right\\|', name: 'auto-sized norm' },
        { display: '⟨⋯⟩', code: '\\left\\langle {} \\right\\rangle', name: 'auto-sized angle brackets' },
        { display: '⌜', code: '\\ulcorner', name: 'upper left corner', pkg: 'amssymb' },
        { display: '⌝', code: '\\urcorner', name: 'upper right corner', pkg: 'amssymb' },
        { display: '⌞', code: '\\llcorner', name: 'lower left corner', pkg: 'amssymb' },
        { display: '⌟', code: '\\lrcorner', name: 'lower right corner', pkg: 'amssymb' },
        { display: '\\', code: '\\backslash', name: 'backslash delimiter' }
      ]
    },
    {
      id: 'structures',
      labelKey: 'editor.symCat.structures',
      icon: 'a/b',
      symbols: [
        { display: 'a/b', code: '\\frac{}{}', name: 'fraction', keywords: ['fração', 'divisão'] },
        { display: 'a⁄b', code: '\\dfrac{}{}', name: 'display fraction', pkg: 'amsmath' },
        { display: 'ᵃ⁄ᵦ', code: '\\tfrac{}{}', name: 'text fraction', pkg: 'amsmath' },
        { display: '(ⁿₖ)', code: '\\binom{}{}', name: 'binomial coefficient', pkg: 'amsmath', keywords: ['combinação'] },
        { display: '√x', code: '\\sqrt{}', name: 'square root', keywords: ['raiz quadrada'] },
        { display: 'ⁿ√x', code: '\\sqrt[]{}', name: 'nth root', keywords: ['raiz enésima'] },
        { display: 'xⁿ', code: '^{}', name: 'superscript / power', keywords: ['expoente', 'potência'] },
        { display: 'xₙ', code: '_{}', name: 'subscript / index', keywords: ['subscrito', 'índice'] },
        { display: '∑ⁿᵢ', code: '\\sum_{}^{}', name: 'sum with bounds', keywords: ['somatório limites'] },
        { display: '∫ᵇₐ', code: '\\int_{}^{}', name: 'definite integral', keywords: ['integral definida'] },
        { display: 'lim→', code: '\\lim_{ \\to }', name: 'limit with arrow', keywords: ['limite'] },
        { display: '∏ⁿᵢ', code: '\\prod_{}^{}', name: 'product with bounds', keywords: ['produtório'] },
        { display: 'x̬', code: '\\underset{}{}', name: 'underset', pkg: 'amsmath' },
        { display: 'x̊', code: '\\overset{}{}', name: 'overset', pkg: 'amsmath' },
        { display: '≝', code: '\\stackrel{}{}', name: 'stack relation' },
        { display: 'txt', code: '\\text{}', name: 'text inside math', pkg: 'amsmath', keywords: ['texto'] },
        { display: '□x', code: '\\boxed{}', name: 'boxed formula', pkg: 'amsmath', keywords: ['caixa', 'destaque'] },
        { display: '{⋮', code: '\\begin{cases}\n  \n\\end{cases}', name: 'piecewise cases', pkg: 'amsmath', keywords: ['casos', 'chaves'] },
        { display: '(⋮)', code: '\\begin{pmatrix}\n  \n\\end{pmatrix}', name: 'parenthesized matrix', pkg: 'amsmath', keywords: ['matriz'] },
        { display: '[⋮]', code: '\\begin{bmatrix}\n  \n\\end{bmatrix}', name: 'bracketed matrix', pkg: 'amsmath', keywords: ['matriz'] },
        { display: '|⋮|', code: '\\begin{vmatrix}\n  \n\\end{vmatrix}', name: 'determinant matrix', pkg: 'amsmath', keywords: ['determinante'] }
      ]
    },
    {
      id: 'accents',
      labelKey: 'editor.symCat.accents',
      icon: 'x̂',
      symbols: [
        { display: 'x̂', code: '\\hat{}', name: 'hat', keywords: ['chapéu', 'estimator'] },
        { display: 'x̂w', code: '\\widehat{}', name: 'wide hat' },
        { display: 'x̄', code: '\\bar{}', name: 'bar / conjugate', keywords: ['barra', 'média'] },
        { display: 'x̅w', code: '\\overline{}', name: 'overline' },
        { display: 'x̲', code: '\\underline{}', name: 'underline', keywords: ['sublinhado'] },
        { display: 'x⃗', code: '\\vec{}', name: 'vector arrow', keywords: ['vetor'] },
        { display: 'x⃗w', code: '\\overrightarrow{}', name: 'over right arrow', keywords: ['vetor'] },
        { display: 'x⃖w', code: '\\overleftarrow{}', name: 'over left arrow' },
        { display: 'x̃', code: '\\tilde{}', name: 'tilde', keywords: ['til'] },
        { display: 'x̃w', code: '\\widetilde{}', name: 'wide tilde' },
        { display: 'ẋ', code: '\\dot{}', name: 'first time derivative dot' },
        { display: 'ẍ', code: '\\ddot{}', name: 'second time derivative dots' },
        { display: 'x⃛', code: '\\dddot{}', name: 'third derivative dots', pkg: 'amsmath' },
        { display: 'x̌', code: '\\check{}', name: 'caron / check' },
        { display: 'x́', code: '\\acute{}', name: 'acute accent' },
        { display: 'x̀', code: '\\grave{}', name: 'grave accent' },
        { display: 'x̆', code: '\\breve{}', name: 'breve' },
        { display: '⏞', code: '\\overbrace{}^{}', name: 'overbrace' },
        { display: '⏟', code: '\\underbrace{}_{}', name: 'underbrace' },
        { display: '̸', code: '\\not', name: 'negation slash', keywords: ['negação'] }
      ]
    },
    {
      id: 'dots',
      labelKey: 'editor.symCat.dots',
      icon: '⋯',
      symbols: [
        { display: '…', code: '\\dots', name: 'context-aware dots', keywords: ['reticências'] },
        { display: '⋯', code: '\\cdots', name: 'centered horizontal dots', keywords: ['pontos centrais'] },
        { display: '…', code: '\\ldots', name: 'baseline horizontal dots', keywords: ['pontos linha'] },
        { display: '⋮', code: '\\vdots', name: 'vertical dots', keywords: ['pontos verticais'] },
        { display: '⋱', code: '\\ddots', name: 'diagonal dots', keywords: ['pontos diagonais'] },
        { display: '⋰', code: '\\iddots', name: 'inverse diagonal dots', pkg: 'mathdots' },
        { display: '·', code: '\\cdotp', name: 'punctuation center dot' },
        { display: ':', code: '\\colon', name: 'function colon', keywords: ['dois pontos'] }
      ]
    },
    {
      id: 'geometryMisc',
      labelKey: 'editor.symCat.geometryMisc',
      icon: '∞',
      symbols: [
        { display: '∞', code: '\\infty', name: 'infinity', keywords: ['infinito'] },
        { display: '∠', code: '\\angle', name: 'angle', keywords: ['ângulo'] },
        { display: '∡', code: '\\measuredangle', name: 'measured angle', pkg: 'amssymb' },
        { display: '∢', code: '\\sphericalangle', name: 'spherical angle', pkg: 'amssymb' },
        { display: '△', code: '\\triangle', name: 'triangle', keywords: ['triângulo'] },
        { display: '▽', code: '\\triangledown', name: 'inverted triangle', pkg: 'amssymb' },
        { display: '□', code: '\\square', name: 'square / d\'Alembertian', pkg: 'amssymb', keywords: ['quadrado', 'qed'] },
        { display: '■', code: '\\blacksquare', name: 'black square / QED', pkg: 'amssymb', keywords: ['qed'] },
        { display: '◊', code: '\\lozenge', name: 'lozenge', pkg: 'amssymb' },
        { display: '◆', code: '\\blacklozenge', name: 'black lozenge', pkg: 'amssymb' },
        { display: '★', code: '\\bigstar', name: 'filled star', pkg: 'amssymb' },
        { display: '♢', code: '\\diamondsuit', name: 'diamond suit' },
        { display: '♡', code: '\\heartsuit', name: 'heart suit' },
        { display: '♣', code: '\\clubsuit', name: 'club suit' },
        { display: '♠', code: '\\spadesuit', name: 'spade suit' },
        { display: '′', code: '\\prime', name: 'prime / derivative', keywords: ['linha'] },
        { display: '‵', code: '\\backprime', name: 'reversed prime', pkg: 'amssymb' },
        { display: '°', code: '^\\circ', name: 'degree superscript', keywords: ['graus'] },
        { display: '°', code: '\\degree', name: 'degree macro', pkg: 'gensymb', keywords: ['graus'] },
        { display: '℃', code: '\\celsius', name: 'Celsius', pkg: 'gensymb' },
        { display: 'ℏ', code: '\\hbar', name: 'reduced Planck constant', keywords: ['planck'] },
        { display: 'ℏ', code: '\\hslash', name: 'slashed hbar', pkg: 'amssymb' },
        { display: 'ℓ', code: '\\ell', name: 'script small l', keywords: ['ell'] },
        { display: '℘', code: '\\wp', name: 'Weierstrass p' },
        { display: 'ℜ', code: '\\Re', name: 'real part', keywords: ['parte real'] },
        { display: 'ℑ', code: '\\Im', name: 'imaginary part', keywords: ['parte imaginária'] },
        { display: 'ı', code: '\\imath', name: 'dotless i' },
        { display: 'ȷ', code: '\\jmath', name: 'dotless j' },
        { display: 'ð', code: '\\eth', name: 'eth', pkg: 'amssymb' },
        { display: '℧', code: '\\mho', name: 'mho (inverted Omega)', pkg: 'amssymb' },
        { display: '♭', code: '\\flat', name: 'musical flat' },
        { display: '♮', code: '\\natural', name: 'musical natural' },
        { display: '♯', code: '\\sharp', name: 'musical sharp' },
        { display: '✓', code: '\\checkmark', name: 'checkmark', pkg: 'amssymb' },
        { display: '✠', code: '\\maltese', name: 'Maltese cross', pkg: 'amssymb' },
        { display: '¶', code: '\\P', name: 'pilcrow / paragraph' },
        { display: '§', code: '\\S', name: 'section mark', keywords: ['seção'] },
        { display: '†', code: '\\dag', name: 'text dagger' },
        { display: '‡', code: '\\ddag', name: 'text double dagger' }
      ]
    },
    {
      id: 'functions',
      labelKey: 'editor.symCat.functions',
      icon: 'sin',
      symbols: [
        { display: 'sin', code: '\\sin', name: 'sine', keywords: ['seno'] },
        { display: 'cos', code: '\\cos', name: 'cosine', keywords: ['cosseno'] },
        { display: 'tan', code: '\\tan', name: 'tangent', keywords: ['tangente'] },
        { display: 'cot', code: '\\cot', name: 'cotangent', keywords: ['cotangente'] },
        { display: 'sec', code: '\\sec', name: 'secant', keywords: ['secante'] },
        { display: 'csc', code: '\\csc', name: 'cosecant', keywords: ['cossecante'] },
        { display: 'arcsin', code: '\\arcsin', name: 'arcsine', keywords: ['arcoseno'] },
        { display: 'arccos', code: '\\arccos', name: 'arccosine', keywords: ['arcocosseno'] },
        { display: 'arctan', code: '\\arctan', name: 'arctangent', keywords: ['arcotangente'] },
        { display: 'sinh', code: '\\sinh', name: 'hyperbolic sine' },
        { display: 'cosh', code: '\\cosh', name: 'hyperbolic cosine' },
        { display: 'tanh', code: '\\tanh', name: 'hyperbolic tangent' },
        { display: 'coth', code: '\\coth', name: 'hyperbolic cotangent' },
        { display: 'ln', code: '\\ln', name: 'natural logarithm', keywords: ['logaritmo'] },
        { display: 'logₐ', code: '\\log_{}', name: 'logarithm with base', keywords: ['logaritmo', 'base', 'log'] },
        { display: 'lg', code: '\\lg', name: 'base-2 / common log' },
        { display: 'exp', code: '\\exp', name: 'exponential', keywords: ['exponencial'] },
        { display: 'det', code: '\\det', name: 'determinant', keywords: ['determinante'] },
        { display: 'dim', code: '\\dim', name: 'dimension', keywords: ['dimensão'] },
        { display: 'ker', code: '\\ker', name: 'kernel', keywords: ['núcleo'] },
        { display: 'hom', code: '\\hom', name: 'homomorphism', keywords: ['homomorfismo'] },
        { display: 'deg', code: '\\deg', name: 'degree of polynomial', keywords: ['grau'] },
        { display: 'gcd', code: '\\gcd', name: 'greatest common divisor', keywords: ['mdc'] },
        { display: 'arg', code: '\\arg', name: 'argument', keywords: ['argumento'] },
        { display: 'mod', code: '\\bmod', name: 'binary modulo', keywords: ['módulo'] },
        { display: '(mod)', code: '\\pmod{}', name: 'parenthesized modulo', keywords: ['módulo'] },
        { display: 'Pr', code: '\\Pr', name: 'probability', keywords: ['probabilidade'] }
      ]
    },
    {
      id: 'alphabets',
      labelKey: 'editor.symCat.alphabets',
      icon: 'ℝ',
      symbols: [
        { display: 'ℝ', code: '\\mathbb{R}', name: 'real numbers', pkg: 'amssymb', keywords: ['reais'] },
        { display: 'ℕ', code: '\\mathbb{N}', name: 'natural numbers', pkg: 'amssymb', keywords: ['naturais'] },
        { display: 'ℤ', code: '\\mathbb{Z}', name: 'integers', pkg: 'amssymb', keywords: ['inteiros'] },
        { display: 'ℚ', code: '\\mathbb{Q}', name: 'rationals', pkg: 'amssymb', keywords: ['racionais'] },
        { display: 'ℂ', code: '\\mathbb{C}', name: 'complex numbers', pkg: 'amssymb', keywords: ['complexos'] },
        { display: 'ℙ', code: '\\mathbb{P}', name: 'primes / projective / probability', pkg: 'amssymb' },
        { display: '𝔼', code: '\\mathbb{E}', name: 'expected value / Euclidean', pkg: 'amssymb', keywords: ['esperança'] },
        { display: '𝔽', code: '\\mathbb{F}', name: 'finite field', pkg: 'amssymb', keywords: ['corpo'] },
        { display: 'ℍ', code: '\\mathbb{H}', name: 'quaternions / upper half-plane', pkg: 'amssymb' },
        { display: '𝕂', code: '\\mathbb{K}', name: 'generic field', pkg: 'amssymb' },
        { display: '𝔸', code: '\\mathbb{}', name: 'blackboard bold template', pkg: 'amssymb' },
        { display: '𝒜', code: '\\mathcal{}', name: 'calligraphic math template', keywords: ['caligráfico'] },
        { display: '𝓐', code: '\\mathcal{A}', name: 'calligraphic A' },
        { display: 'ℬ', code: '\\mathcal{B}', name: 'calligraphic B' },
        { display: '𝒞', code: '\\mathcal{C}', name: 'calligraphic C' },
        { display: 'ℱ', code: '\\mathcal{F}', name: 'calligraphic F / Fourier' },
        { display: '𝒢', code: '\\mathcal{G}', name: 'calligraphic G' },
        { display: 'ℋ', code: '\\mathcal{H}', name: 'calligraphic H / Hilbert' },
        { display: 'ℒ', code: '\\mathcal{L}', name: 'calligraphic L / Laplace' },
        { display: '𝒩', code: '\\mathcal{N}', name: 'calligraphic N / Normal' },
        { display: '𝒪', code: '\\mathcal{O}', name: 'calligraphic O / Big-O' },
        { display: '𝒫', code: '\\mathcal{P}', name: 'calligraphic P / Power set' },
        { display: '𝒮', code: '\\mathscr{}', name: 'script math template', pkg: 'mathrsfs' },
        { display: '𝔄', code: '\\mathfrak{}', name: 'Fraktur template', pkg: 'amssymb' },
        { display: '𝐁', code: '\\mathbf{}', name: 'upright bold math' },
        { display: '𝐑', code: '\\mathrm{}', name: 'roman / upright math' },
        { display: '𝐼', code: '\\mathit{}', name: 'italic math' },
        { display: '𝖲', code: '\\mathsf{}', name: 'sans-serif math' },
        { display: '𝚃', code: '\\mathtt{}', name: 'monospace math' },
        { display: '𝜶', code: '\\boldsymbol{}', name: 'bold math symbol', pkg: 'amsmath' }
      ]
    },
    {
      id: 'linguistic',
      labelKey: 'editor.symCat.linguistic',
      icon: '—',
      symbols: [
        { display: '—', code: '---', name: 'em dash', textMode: true, keywords: ['travessão', 'dash', 'em-dash'] },
        { display: '–', code: '--', name: 'en dash', textMode: true, keywords: ['meia-risca', 'intervalo', 'en-dash'] },
        { display: '—m', code: '\\textemdash', name: 'text em dash', textMode: true, keywords: ['travessão'] },
        { display: '“\u2009”', code: "``''", name: 'double quotation marks', textMode: true, keywords: ['aspas duplas', 'quotes'] },
        { display: '‘\u2009’', code: "`'", name: 'single quotation marks', textMode: true, keywords: ['aspas simples', 'quotes'] },
        { display: '“', code: '``', name: 'left double quote', textMode: true, keywords: ['aspas abertura'] },
        { display: '”', code: "''", name: 'right double quote', textMode: true, keywords: ['aspas fechamento'] },
        { display: '«»', code: '\\guillemotleft{}\\guillemotright{}', name: 'guillemets', textMode: true, keywords: ['aspas angulares'] },
        { display: '…', code: '\\ldots', name: 'ellipsis / three dots', textMode: true, keywords: ['três pontos', 'reticências'] },
        { display: ':', code: ':', name: 'colon', textMode: true, keywords: ['dois pontos'] },
        { display: ';', code: ';', name: 'semicolon', textMode: true, keywords: ['ponto e vírgula'] },
        { display: '¡', code: '!`', name: 'inverted exclamation mark', textMode: true, keywords: ['exclamação'] },
        { display: '¿', code: '?`', name: 'inverted question mark', textMode: true, keywords: ['interrogação'] },
        { display: '␣', code: '~', name: 'non-breaking space', textMode: true, keywords: ['espaço inseparável'] },
        { display: '§', code: '\\S', name: 'section mark', textMode: true, keywords: ['seção'] },
        { display: '¶', code: '\\P', name: 'pilcrow / paragraph sign', textMode: true, keywords: ['parágrafo'] },
        { display: 'º', code: '\\textordmasculine', name: 'masculine ordinal', textMode: true, keywords: ['ordinal', 'grau'] },
        { display: 'ª', code: '\\textordfeminine', name: 'feminine ordinal', textMode: true, keywords: ['ordinal'] },
        { display: '•', code: '\\textbullet', name: 'bullet point', textMode: true, keywords: ['marcador', 'tópico'] },
        { display: '©', code: '\\copyright', name: 'copyright sign', textMode: true, keywords: ['direitos autorais'] },
        { display: '®', code: '\\textregistered', name: 'registered trademark', textMode: true, keywords: ['marca registrada'] },
        { display: '™', code: '\\texttrademark', name: 'trademark sign', textMode: true, keywords: ['marca comercial'] },
        { display: '†', code: '\\dag', name: 'dagger note', textMode: true, keywords: ['nota', 'adaga'] },
        { display: '‡', code: '\\ddag', name: 'double dagger note', textMode: true, keywords: ['nota', 'dupla adaga'] },
        { display: '$', code: '\\$', name: 'escaped dollar sign', textMode: true, keywords: ['cifrão', 'moeda'] },
        { display: '%', code: '\\%', name: 'escaped percent sign', textMode: true, keywords: ['porcentagem'] },
        { display: '&', code: '\\&', name: 'escaped ampersand', textMode: true, keywords: ['e comercial'] },
        { display: '#', code: '\\#', name: 'escaped hash / number sign', textMode: true, keywords: ['cerquilha', 'sustenido'] },
        { display: '_', code: '\\_', name: 'escaped underscore', textMode: true, keywords: ['sublinhado'] },
        { display: '£', code: '\\pounds', name: 'pound sterling sign', textMode: true, keywords: ['libra', 'moeda'] },
        { display: '€', code: '\\euro', name: 'euro sign', pkg: 'eurosym', textMode: true, keywords: ['euro', 'moeda'] },
        { display: '\\', code: '\\textbackslash', name: 'text backslash', textMode: true, keywords: ['barra invertida'] },
        { display: '~', code: '\\textasciitilde', name: 'text tilde', textMode: true, keywords: ['til'] },
        { display: '^', code: '\\textasciicircum', name: 'text circumflex', textMode: true, keywords: ['circunflexo'] }
      ]
    }
  ];

  function filter(query, translateFn) {
    var q = String(query || '').replace(/^\s+|\s+$/g, '').toLowerCase();
    if (!q) return CATEGORIES;
    var result = [];
    for (var i = 0; i < CATEGORIES.length; i++) {
      var cat = CATEGORIES[i];
      var title = (translateFn ? translateFn(cat.labelKey) : cat.id).toLowerCase();
      if (title.indexOf(q) !== -1) {
        result.push(cat);
        continue;
      }
      var matched = [];
      for (var j = 0; j < cat.symbols.length; j++) {
        var s = cat.symbols[j];
        var hit = s.code.toLowerCase().indexOf(q) !== -1
          || s.name.toLowerCase().indexOf(q) !== -1
          || s.display.toLowerCase().indexOf(q) !== -1
          || (s.pkg && s.pkg.toLowerCase().indexOf(q) !== -1);
        if (!hit && s.keywords) {
          for (var k = 0; k < s.keywords.length; k++) {
            if (s.keywords[k].toLowerCase().indexOf(q) !== -1) {
              hit = true;
              break;
            }
          }
        }
        if (hit) matched.push(s);
      }
      if (matched.length) {
        result.push({
          id: cat.id,
          labelKey: cat.labelKey,
          icon: cat.icon,
          symbols: matched
        });
      }
    }
    return result;
  }

  var VERBATIM_ENVS = {
    verbatim: 1, 'verbatim*': 1, Verbatim: 1, 'Verbatim*': 1,
    BVerbatim: 1, 'BVerbatim*': 1, LVerbatim: 1, 'LVerbatim*': 1,
    lstlisting: 1, minted: 1, comment: 1, filecontents: 1, 'filecontents*': 1,
    spverbatim: 1, verbatimtab: 1
  };

  var MATH_ENVS = {
    equation: 1, 'equation*': 1, align: 1, 'align*': 1, alignat: 1, 'alignat*': 1,
    flalign: 1, 'flalign*': 1, gather: 1, 'gather*': 1, multline: 1, 'multline*': 1,
    eqnarray: 1, 'eqnarray*': 1, math: 1, displaymath: 1, dmath: 1, 'dmath*': 1
  };

  var TEXT_MODE_COMMANDS = {
    text: 1, textrm: 1, textbf: 1, textit: 1, textsf: 1, texttt: 1,
    mbox: 1, hbox: 1, intertext: 1, shortintertext: 1
  };

  function isAlphaCode(c) {
    return (c >= 65 && c <= 90) || (c >= 97 && c <= 122);
  }

  function isEscapedAt(text, idx) {
    var backslashes = 0;
    for (var i = idx - 1; i >= 0 && text.charCodeAt(i) === 92; i--) {
      backslashes++;
    }
    return (backslashes & 1) === 1;
  }

  function isInMathMode(text, pos) {
    var limit = Math.max(0, Math.min(Math.floor(pos || 0), text.length));
    var mode = 'none';
    var envName = '';
    var verbatimEnv = null;
    var braceDepth = 0;
    var atLineStart = true;
    var frames = [];
    var i = 0;

    while (i < limit) {
      var ch = text.charCodeAt(i);

      if (verbatimEnv !== null) {
        if (ch === 92 && text.slice(i, i + 4) === '\\end') {
          var j = i + 4;
          while (j < limit && (text.charCodeAt(j) === 32 || text.charCodeAt(j) === 9)) j++;
          if (j < limit && text.charCodeAt(j) === 123) {
            var closeVerb = text.indexOf('}', j + 1);
            if (closeVerb !== -1 && closeVerb < limit) {
              var endName = text.slice(j + 1, closeVerb).replace(/^\s+|\s+$/g, '');
              if (endName === verbatimEnv) {
                verbatimEnv = null;
                atLineStart = false;
                i = closeVerb + 1;
                continue;
              }
            }
          }
        }
        if (ch === 10) atLineStart = true;
        else if (ch !== 13 && ch !== 32 && ch !== 9) atLineStart = false;
        i++;
        continue;
      }

      if (ch === 10) {
        if (atLineStart && mode === 'dollar') mode = 'none';
        atLineStart = true;
        i++;
        continue;
      }

      if (ch === 13 || ch === 32 || ch === 9) {
        i++;
        continue;
      }

      if (ch === 37) {
        atLineStart = false;
        while (i < limit && text.charCodeAt(i) !== 10) i++;
        continue;
      }

      atLineStart = false;

      if (ch === 92) {
        if (i + 1 >= limit) {
          i++;
          continue;
        }
        var next = text.charCodeAt(i + 1);
        if (!isAlphaCode(next)) {
          if (next === 40 && mode === 'none') mode = 'paren';
          else if (next === 41 && mode === 'paren') mode = 'none';
          else if (next === 91 && mode === 'none') mode = 'bracket';
          else if (next === 93 && mode === 'bracket') mode = 'none';
          i += 2;
          continue;
        }

        var endCmd = i + 1;
        while (endCmd < limit && isAlphaCode(text.charCodeAt(endCmd))) endCmd++;
        var cmd = text.slice(i + 1, endCmd);
        i = endCmd;

        if (cmd === 'verb' || cmd === 'lstinline') {
          if (i < limit && text.charCodeAt(i) === 42) i++;
          if (i < limit && text.charCodeAt(i) !== 10) {
            var delim = text.charCodeAt(i);
            i++;
            while (i < limit && text.charCodeAt(i) !== delim && text.charCodeAt(i) !== 10) i++;
            if (i < limit && text.charCodeAt(i) === delim) i++;
          }
          continue;
        }

        if (cmd === 'begin' || cmd === 'end') {
          var k = i;
          while (k < limit && (text.charCodeAt(k) === 32 || text.charCodeAt(k) === 9)) k++;
          if (k < limit && text.charCodeAt(k) === 123) {
            var closeBrace = text.indexOf('}', k + 1);
            if (closeBrace !== -1 && closeBrace < limit) {
              var name = text.slice(k + 1, closeBrace).replace(/^\s+|\s+$/g, '');
              if (cmd === 'begin') {
                if (Object.prototype.hasOwnProperty.call(VERBATIM_ENVS, name)) verbatimEnv = name;
                else if (mode === 'none' && Object.prototype.hasOwnProperty.call(MATH_ENVS, name)) {
                  mode = 'env';
                  envName = name;
                }
              } else if (mode === 'env' && name === envName) {
                mode = 'none';
                envName = '';
              }
              i = closeBrace + 1;
            }
          }
          continue;
        }

        if (mode !== 'none' && Object.prototype.hasOwnProperty.call(TEXT_MODE_COMMANDS, cmd)) {
          var kText = i;
          while (kText < limit && (text.charCodeAt(kText) === 32 || text.charCodeAt(kText) === 9)) kText++;
          if (kText < limit && text.charCodeAt(kText) === 123) {
            frames.push({ mode: mode, envName: envName, returnBraceDepth: braceDepth });
            mode = 'none';
            envName = '';
            braceDepth++;
            i = kText + 1;
          }
        }
        continue;
      }

      if (ch === 123) {
        braceDepth++;
        i++;
        continue;
      }

      if (ch === 125) {
        if (braceDepth > 0) braceDepth--;
        if (frames.length > 0 && frames[frames.length - 1].returnBraceDepth === braceDepth) {
          var restored = frames.pop();
          mode = restored.mode;
          envName = restored.envName;
        }
        i++;
        continue;
      }

      if (ch === 36) {
        if (mode === 'dollar') {
          mode = 'none';
          i++;
        } else if (mode === 'double') {
          if (i + 1 < limit && text.charCodeAt(i + 1) === 36) i += 2;
          else i++;
          mode = 'none';
        } else if (mode === 'none') {
          if (i + 1 < limit && text.charCodeAt(i + 1) === 36) {
            mode = 'double';
            i += 2;
          } else if (i + 1 === limit && i + 1 < text.length && text.charCodeAt(i + 1) === 36) {
            mode = 'dollar';
            i++;
          } else {
            mode = 'dollar';
            i++;
          }
        } else {
          i++;
        }
        continue;
      }

      i++;
    }

    return verbatimEnv === null && mode !== 'none';
  }

  function prepareInsertion(text, from, to, code) {
    var s = Math.max(0, Math.min(Math.floor(from || 0), text.length));
    var e = Math.max(s, Math.min(Math.floor(typeof to === 'number' ? to : s), text.length));

    if (isInMathMode(text, s)) {
      return { from: s, to: e, text: code, moveAfterClosingDollar: false };
    }

    var isMultiline = code.indexOf('\n') !== -1;
    if (s === e && !isMultiline) {
      if (
        s > 0
        && text.charCodeAt(s - 1) === 36
        && (s < 2 || text.charCodeAt(s - 2) !== 36)
        && !isEscapedAt(text, s - 1)
        && isInMathMode(text, s - 1)
      ) {
        return { from: s - 1, to: s - 1, text: code, moveAfterClosingDollar: true };
      }
      if (
        s < text.length
        && text.charCodeAt(s) === 36
        && text.charCodeAt(s + 1) !== 36
        && !isEscapedAt(text, s)
        && isInMathMode(text, s + 1)
      ) {
        var nextCh = s + 1 < text.length ? text.charCodeAt(s + 1) : 0;
        var needsSpace = /\\[A-Za-z]+$/.test(code) && isAlphaCode(nextCh);
        return {
          from: s + 1,
          to: s + 1,
          text: needsSpace ? (code + ' ') : code,
          moveAfterClosingDollar: false
        };
      }
    }

    return {
      from: s,
      to: e,
      text: isMultiline ? ('\\[\n' + code + '\n\\]') : ('$' + code + '$'),
      moveAfterClosingDollar: false
    };
  }

  var VALID_PACKAGE_NAME_RE = /^[A-Za-z0-9._-]+$/;
  var PACKAGE_CMD_RE = /\\(?:usepackage|RequirePackage)(?:\s*\[[^\]]*\])?\s*\{([^}]+)\}/g;
  var DOCCLASS_CMD_RE = /\\documentclass(?:\s*\[[^\]]*\])?\s*\{[^}]+\}/;
  var BEGIN_DOC_RE = /\\begin\s*\{document\}/;
  var ENV_TAG_RE = /\\(begin|end)\s*\{([A-Za-z][A-Za-z0-9*]*)\}/g;
  var BRACKET_PAIRS = { '{': '}', '(': ')', '[': ']' };
  var REVERSE_BRACKETS = { '}': '{', ')': '(', ']': '[' };

  function detectEol(text, fallback) {
    if (fallback) return fallback;
    return text.indexOf('\r\n') !== -1 ? '\r\n' : '\n';
  }

  function commentStartIdx(text, from, to) {
    for (var i = from; i < to; i++) {
      if (text.charCodeAt(i) === 37 && !isEscapedAt(text, i)) return i;
    }
    return -1;
  }

  function isInsideLineComment(text, idx) {
    var lineStart = text.lastIndexOf('\n', Math.max(0, idx - 1)) + 1;
    var cStart = commentStartIdx(text, lineStart, idx);
    return cStart >= 0 && cStart <= idx;
  }

  function maskTexComments(text) {
    var chars = text.split('');
    for (var i = 0; i < text.length; i++) {
      if (text.charCodeAt(i) === 37 && !isEscapedAt(text, i)) {
        while (i < text.length && text.charCodeAt(i) !== 10 && text.charCodeAt(i) !== 13) {
          chars[i] = ' ';
          i++;
        }
      }
    }
    return chars.join('');
  }

  function insertOffsetAfter(text, cmdEnd, maxLimit) {
    var nl = text.indexOf('\n', cmdEnd);
    if (nl !== -1 && nl + 1 <= maxLimit) return nl + 1;
    if (maxLimit < text.length) return maxLimit;
    return cmdEnd;
  }

  function preambleScanInfo(text) {
    var imported = {};
    var uncommented = maskTexComments(text);
    var beginMatch = BEGIN_DOC_RE.exec(uncommented);
    var preambleLimit = beginMatch ? beginMatch.index : uncommented.length;
    var preamble = uncommented.slice(0, preambleLimit);

    var hasPreamble = !!beginMatch;
    var beginDocOffset = beginMatch
      ? text.lastIndexOf('\n', Math.max(0, beginMatch.index - 1)) + 1
      : null;

    var docMatch = DOCCLASS_CMD_RE.exec(preamble);
    var docClassOffset = null;
    if (docMatch) {
      hasPreamble = true;
      docClassOffset = insertOffsetAfter(text, docMatch.index + docMatch[0].length, preambleLimit);
    }

    PACKAGE_CMD_RE.lastIndex = 0;
    var m;
    var lastPkgEnd = -1;
    while ((m = PACKAGE_CMD_RE.exec(preamble)) !== null) {
      hasPreamble = true;
      lastPkgEnd = m.index + m[0].length;
      var parts = m[1].split(',');
      for (var pi = 0; pi < parts.length; pi++) {
        var name = parts[pi].replace(/^\s+|\s+$/g, '');
        if (name) imported[name] = true;
      }
    }
    var lastPkgOffset = lastPkgEnd >= 0 ? insertOffsetAfter(text, lastPkgEnd, preambleLimit) : null;

    return {
      hasPreamble: hasPreamble,
      imported: imported,
      lastPkgOffset: lastPkgOffset,
      docClassOffset: docClassOffset,
      beginDocOffset: beginDocOffset
    };
  }

  function isPackageSatisfied(imported, target) {
    if (Object.prototype.hasOwnProperty.call(imported, target)) return true;
    if (target === 'amsmath' && Object.prototype.hasOwnProperty.call(imported, 'mathtools')) return true;
    if (target === 'amsfonts' && Object.prototype.hasOwnProperty.call(imported, 'amssymb')) return true;
    return false;
  }

  function hasPackageImport(text, pkg) {
    var target = String(pkg || '').replace(/^\s+|\s+$/g, '');
    if (!VALID_PACKAGE_NAME_RE.test(target)) return false;
    return isPackageSatisfied(preambleScanInfo(text).imported, target);
  }

  function planPackageImport(text, pkg, eol) {
    var target = String(pkg || '').replace(/^\s+|\s+$/g, '');
    if (!VALID_PACKAGE_NAME_RE.test(target)) return null;
    var info = preambleScanInfo(text);
    if (!info.hasPreamble || isPackageSatisfied(info.imported, target)) return null;

    var insertAt = info.lastPkgOffset !== null
      ? info.lastPkgOffset
      : (info.docClassOffset !== null ? info.docClassOffset : info.beginDocOffset);
    if (insertAt === null) return null;

    var resolvedEol = detectEol(text, eol);
    var prevCh = insertAt > 0 ? text.charCodeAt(insertAt - 1) : 10;
    var nextCh = insertAt < text.length ? text.charCodeAt(insertAt) : 10;
    var needsLeadingEol = insertAt > 0 && prevCh !== 10 && prevCh !== 13;
    var needsTrailingEol = insertAt < text.length && nextCh !== 10 && nextCh !== 13;
    var directive = '\\usepackage{' + target + '}';
    var leading = needsLeadingEol ? resolvedEol : '';
    var trailing = (needsLeadingEol && !needsTrailingEol) ? '' : resolvedEol;
    return {
      offset: insertAt,
      text: leading + directive + trailing
    };
  }

  function mergeTextRanges(a, b) {
    var first = a.from <= b.from ? a : b;
    var second = a.from <= b.from ? b : a;
    if (first.to >= second.from) {
      return [{ from: first.from, to: Math.max(first.to, second.to) }];
    }
    return [first, second];
  }

  function collectEnvTags(text) {
    ENV_TAG_RE.lastIndex = 0;
    var matches = [];
    var m;
    while ((m = ENV_TAG_RE.exec(text)) !== null) {
      var idx = m.index;
      if (isEscapedAt(text, idx) || isInsideLineComment(text, idx)) continue;
      matches.push({ kind: m[1], env: m[2], from: idx, to: idx + m[0].length });
    }
    return matches;
  }

  function findBeginAutoClose(docAfterBrace, caretAfterBrace, indentUnit, eol) {
    var pos = Math.max(0, Math.min(Math.floor(caretAfterBrace || 0), docAfterBrace.length));
    var lineStart = docAfterBrace.lastIndexOf('\n', pos - 1) + 1;
    var lineHead = docAfterBrace.slice(lineStart, pos);
    if (commentStartIdx(lineHead, 0, lineHead.length) >= 0) return null;

    var match = /\\begin\{([A-Za-z][A-Za-z0-9*]*)\}$/.exec(lineHead);
    if (!match) return null;
    if (isEscapedAt(docAfterBrace, lineStart + match.index)) return null;

    var env = match[1];
    var tags = collectEnvTags(docAfterBrace);
    var begins = 0;
    var ends = 0;
    for (var i = 0; i < tags.length; i++) {
      if (tags[i].env !== env) continue;
      if (tags[i].kind === 'begin') begins++;
      else ends++;
    }
    if (begins <= ends) return null;

    var indentMatch = /^[ \t]*/.exec(docAfterBrace.slice(lineStart));
    var indent = indentMatch ? indentMatch[0] : '';
    var resolvedEol = detectEol(docAfterBrace, eol);
    var bodyPrefix = resolvedEol + indent + (typeof indentUnit === 'string' ? indentUnit : '  ');
    return {
      insert: bodyPrefix + resolvedEol + indent + '\\end{' + env + '}',
      caretOffset: bodyPrefix.length
    };
  }

  function findEnvDeletion(text, pos, direction) {
    var matches = collectEnvTags(text);
    var hitIdx = -1;
    for (var i = 0; i < matches.length; i++) {
      if (direction === 'backward' ? matches[i].to === pos : matches[i].from === pos) {
        hitIdx = i;
        break;
      }
    }
    if (hitIdx === -1) return null;
    var hit = matches[hitIdx];

    var partnerIdx = -1;
    var depth = 1;
    if (hit.kind === 'begin') {
      for (var fi = hitIdx + 1; fi < matches.length; fi++) {
        if (matches[fi].env !== hit.env) continue;
        depth += matches[fi].kind === 'begin' ? 1 : -1;
        if (depth === 0) { partnerIdx = fi; break; }
      }
    } else {
      for (var bi = hitIdx - 1; bi >= 0; bi--) {
        if (matches[bi].env !== hit.env) continue;
        depth += matches[bi].kind === 'end' ? 1 : -1;
        if (depth === 0) { partnerIdx = bi; break; }
      }
    }
    if (partnerIdx === -1) return null;

    var beginTag = hit.kind === 'begin' ? hit : matches[partnerIdx];
    var endTag = hit.kind === 'end' ? hit : matches[partnerIdx];
    var inner = text.slice(beginTag.to, endTag.from);
    if (/^[ \t\r\n]*$/.test(inner)) {
      return { ranges: [{ from: beginTag.from, to: endTag.to }], caret: beginTag.from };
    }

    var bTo = beginTag.to;
    var beginLineEnd = /^[ \t]*\r?\n/.exec(text.slice(bTo));
    if (beginLineEnd) bTo += beginLineEnd[0].length;

    var eFrom = endTag.from;
    var lineStartBeforeEnd = text.lastIndexOf('\n', eFrom - 1);
    if (lineStartBeforeEnd !== -1 && /^[ \t]*$/.test(text.slice(lineStartBeforeEnd + 1, eFrom))) {
      eFrom = text.charAt(lineStartBeforeEnd - 1) === '\r' ? lineStartBeforeEnd - 1 : lineStartBeforeEnd;
    }

    if (bTo >= eFrom) {
      return { ranges: [{ from: beginTag.from, to: endTag.to }], caret: beginTag.from };
    }
    return {
      ranges: [
        { from: beginTag.from, to: bTo },
        { from: eFrom, to: endTag.to }
      ],
      caret: hit.kind === 'begin' ? beginTag.from : Math.max(beginTag.from, eFrom - (bTo - beginTag.from))
    };
  }

  function findEscapedParenBracketDeletion(text, pos, direction) {
    var start = direction === 'backward' ? pos - 2 : pos;
    if (start < 0 || start + 2 > text.length || text.charCodeAt(start) !== 92) return null;
    if (isEscapedAt(text, start) || isInsideLineComment(text, start)) return null;
    var ch = text.charAt(start + 1);
    var openChar = (ch === '(' || ch === ')') ? '(' : ((ch === '[' || ch === ']') ? '[' : null);
    if (!openChar) return null;
    var closeChar = openChar === '(' ? ')' : ']';

    if (ch === openChar) {
      var depth = 1;
      for (var i = start + 2; i + 1 < text.length; i++) {
        if (text.charCodeAt(i) !== 92 || isEscapedAt(text, i) || isInsideLineComment(text, i)) continue;
        var next = text.charAt(i + 1);
        if (next === openChar) { depth++; i++; }
        else if (next === closeChar) {
          depth--;
          if (depth === 0) {
            return {
              ranges: mergeTextRanges({ from: start, to: start + 2 }, { from: i, to: i + 2 }),
              caret: start
            };
          }
          i++;
        }
      }
    } else {
      var backDepth = 1;
      var lineStartEsc = text.length + 1;
      var cStartEsc = -1;
      for (var j = start - 2; j >= 0; j--) {
        if (j < lineStartEsc) {
          lineStartEsc = text.lastIndexOf('\n', j) + 1;
          cStartEsc = commentStartIdx(text, lineStartEsc, j + 1);
        }
        if ((cStartEsc >= 0 && j >= cStartEsc) || text.charCodeAt(j) !== 92 || isEscapedAt(text, j)) continue;
        var chJ = text.charAt(j + 1);
        if (chJ === closeChar) backDepth++;
        else if (chJ === openChar) {
          backDepth--;
          if (backDepth === 0) {
            return {
              ranges: mergeTextRanges({ from: j, to: j + 2 }, { from: start, to: start + 2 }),
              caret: j + 2 === start ? j : start - 2
            };
          }
        }
      }
    }
    return null;
  }

  function findForwardUnescapedSingleDollar(text, from) {
    for (var i = from; i < text.length; i++) {
      var c = text.charCodeAt(i);
      if (c === 10 && i + 1 < text.length) {
        var j = i + 1;
        while (j < text.length && (text.charCodeAt(j) === 32 || text.charCodeAt(j) === 9 || text.charCodeAt(j) === 13)) j++;
        if (j < text.length && text.charCodeAt(j) === 10) return -1;
      }
      if (c === 37 && !isEscapedAt(text, i)) {
        while (i < text.length && text.charCodeAt(i) !== 10) i++;
        continue;
      }
      if (c === 36 && !isEscapedAt(text, i)) {
        if (text.charCodeAt(i + 1) === 36) {
          i++;
          continue;
        }
        return i;
      }
    }
    return -1;
  }

  function findBackwardUnescapedSingleDollar(text, before) {
    var lineStart = text.length + 1;
    var cStart = -1;
    for (var i = before - 1; i >= 0; i--) {
      if (i < lineStart) {
        lineStart = text.lastIndexOf('\n', i) + 1;
        cStart = commentStartIdx(text, lineStart, i + 1);
      }
      if (text.charCodeAt(i) === 10) {
        var prevNl = text.lastIndexOf('\n', i - 1);
        if (prevNl !== -1 && /^[ \t\r]*$/.test(text.slice(prevNl + 1, i))) return -1;
        continue;
      }
      if (cStart >= 0 && i >= cStart) continue;
      if (text.charCodeAt(i) === 36 && !isEscapedAt(text, i)) {
        if (i > 0 && text.charCodeAt(i - 1) === 36 && !isEscapedAt(text, i - 1)) {
          i--;
          continue;
        }
        if (!isInMathMode(text, i)) return i;
      }
    }
    return -1;
  }

  function findForwardUnescapedDoubleDollar(text, from) {
    for (var i = from; i + 1 < text.length; i++) {
      if (text.charCodeAt(i) === 37 && !isEscapedAt(text, i)) {
        while (i < text.length && text.charCodeAt(i) !== 10) i++;
        continue;
      }
      if (text.charCodeAt(i) === 36 && text.charCodeAt(i + 1) === 36 && !isEscapedAt(text, i)) return i;
    }
    return -1;
  }

  function countForwardUnescapedDoubleDollars(text, from) {
    var count = 0;
    for (var i = from; i + 1 < text.length; i++) {
      if (text.charCodeAt(i) === 37 && !isEscapedAt(text, i)) {
        while (i < text.length && text.charCodeAt(i) !== 10) i++;
        continue;
      }
      if (text.charCodeAt(i) === 36 && text.charCodeAt(i + 1) === 36 && !isEscapedAt(text, i)) {
        count++;
        i++;
      }
    }
    return count;
  }

  function findBackwardUnescapedDoubleDollar(text, before) {
    var lineStart = text.length + 1;
    var cStart = -1;
    for (var i = before - 2; i >= 0; i--) {
      if (i < lineStart) {
        lineStart = text.lastIndexOf('\n', i) + 1;
        cStart = commentStartIdx(text, lineStart, i + 1);
      }
      if (cStart >= 0 && i >= cStart) continue;
      if (text.charCodeAt(i) === 36 && text.charCodeAt(i + 1) === 36 && !isEscapedAt(text, i)) {
        if (!isInMathMode(text, i)) return i;
      }
    }
    return -1;
  }

  function findDollarDeletion(text, pos, direction) {
    if (
      pos > 0
      && pos < text.length
      && text.charCodeAt(pos - 1) === 36
      && text.charCodeAt(pos) === 36
      && !isEscapedAt(text, pos - 1)
      && !isInsideLineComment(text, pos - 1)
      && !isInMathMode(text, pos - 1)
    ) {
      if (countForwardUnescapedDoubleDollars(text, pos + 1) % 2 === 0) {
        return { ranges: [{ from: pos - 1, to: pos + 1 }], caret: pos - 1 };
      }
    }

    var dblStart = direction === 'backward' ? pos - 2 : pos;
    if (
      dblStart >= 0
      && dblStart + 2 <= text.length
      && text.charCodeAt(dblStart) === 36
      && text.charCodeAt(dblStart + 1) === 36
      && !isEscapedAt(text, dblStart)
      && !isInsideLineComment(text, dblStart)
    ) {
      if (!isInMathMode(text, dblStart)) {
        if (countForwardUnescapedDoubleDollars(text, dblStart + 2) % 2 === 1) {
          var closeDbl = findForwardUnescapedDoubleDollar(text, dblStart + 2);
          if (closeDbl !== -1) {
            return {
              ranges: mergeTextRanges({ from: dblStart, to: dblStart + 2 }, { from: closeDbl, to: closeDbl + 2 }),
              caret: dblStart
            };
          }
        }
        if (direction === 'forward') {
          return { ranges: [{ from: dblStart, to: dblStart + 2 }], caret: dblStart };
        }
      } else {
        var openDbl = findBackwardUnescapedDoubleDollar(text, dblStart);
        if (openDbl !== -1) {
          return {
            ranges: mergeTextRanges({ from: openDbl, to: openDbl + 2 }, { from: dblStart, to: dblStart + 2 }),
            caret: openDbl + 2 === dblStart ? openDbl : dblStart - 2
          };
        }
      }
    }

    var idx = direction === 'backward' ? pos - 1 : pos;
    if (idx < 0 || idx >= text.length || text.charCodeAt(idx) !== 36) return null;
    if (isEscapedAt(text, idx) || isInsideLineComment(text, idx)) return null;
    var isPartOfDouble = (idx > 0 && text.charCodeAt(idx - 1) === 36 && !isEscapedAt(text, idx - 1))
      || (idx + 1 < text.length && text.charCodeAt(idx + 1) === 36);
    if (isPartOfDouble) return null;

    if (!isInMathMode(text, idx)) {
      var closeS = findForwardUnescapedSingleDollar(text, idx + 1);
      if (closeS === -1) return null;
      return {
        ranges: mergeTextRanges({ from: idx, to: idx + 1 }, { from: closeS, to: closeS + 1 }),
        caret: idx
      };
    }
    var openS = findBackwardUnescapedSingleDollar(text, idx);
    if (openS === -1) return null;
    return {
      ranges: mergeTextRanges({ from: openS, to: openS + 1 }, { from: idx, to: idx + 1 }),
      caret: openS + 1 === idx ? openS : idx - 1
    };
  }

  function findMatchingCloser(text, openIdx, openChar, closeChar) {
    var depth = 1;
    for (var i = openIdx + 1; i < text.length; i++) {
      var c = text.charAt(i);
      if (c === '%') {
        while (i < text.length && text.charAt(i) !== '\n') i++;
        continue;
      }
      if (c === '\\') { i++; continue; }
      if (c === openChar) depth++;
      else if (c === closeChar) {
        depth--;
        if (depth === 0) return i;
      }
    }
    return -1;
  }

  function findMatchingOpener(text, closeIdx, openChar, closeChar) {
    var depth = 1;
    var lineStart = text.length + 1;
    var cStart = -1;
    for (var i = closeIdx - 1; i >= 0; i--) {
      if (i < lineStart) {
        lineStart = text.lastIndexOf('\n', i) + 1;
        cStart = commentStartIdx(text, lineStart, i + 1);
      }
      if ((cStart >= 0 && i >= cStart) || isEscapedAt(text, i)) continue;
      var c = text.charAt(i);
      if (c === closeChar) depth++;
      else if (c === openChar) {
        depth--;
        if (depth === 0) return i;
      }
    }
    return -1;
  }

  var SIZED_DELIM_COMMANDS = {
    left: 1, right: 1, middle: 1,
    big: 1, bigl: 1, bigr: 1, bigm: 1,
    Big: 1, Bigl: 1, Bigr: 1, Bigm: 1,
    bigg: 1, biggl: 1, biggr: 1, biggm: 1,
    Bigg: 1, Biggl: 1, Biggr: 1, Biggm: 1
  };

  function commandEndingAt(text, endInclusive) {
    var j = endInclusive;
    while (j >= 0 && /[A-Za-z@]/.test(text.charAt(j))) j--;
    if (j < 0 || text.charAt(j) !== '\\' || j === endInclusive || isEscapedAt(text, j)) return null;
    return text.slice(j + 1, endInclusive + 1);
  }

  function skipBalancedGroupBackward(text, closeIdx, openChar, closeChar) {
    var depth = 1;
    var lineStart = text.length + 1;
    var cStart = -1;
    for (var i = closeIdx - 1; i >= 0; i--) {
      if (i < lineStart) {
        lineStart = text.lastIndexOf('\n', i) + 1;
        cStart = commentStartIdx(text, lineStart, i + 1);
      }
      if ((cStart >= 0 && i >= cStart) || isEscapedAt(text, i)) continue;
      var c = text.charAt(i);
      if (c === closeChar) depth++;
      else if (c === openChar) {
        depth--;
        if (depth === 0) return i - 1;
      }
    }
    return -2;
  }

  function isCommandArgumentBrace(text, openIdx) {
    var i = openIdx - 1;
    while (i >= 0 && (text.charAt(i) === ' ' || text.charAt(i) === '\t')) i--;
    while (i >= 0) {
      var ch = text.charAt(i);
      if ((ch === '}' || ch === ']') && !isEscapedAt(text, i)) {
        var next = skipBalancedGroupBackward(text, i, ch === '}' ? '{' : '[', ch);
        if (next < -1) return false;
        i = next;
        while (i >= 0 && (text.charAt(i) === ' ' || text.charAt(i) === '\t')) i--;
        continue;
      }
      break;
    }
    if (i >= 0 && text.charAt(i) === '*') {
      i--;
      while (i >= 0 && (text.charAt(i) === ' ' || text.charAt(i) === '\t')) i--;
    }
    return i >= 0 && commandEndingAt(text, i) !== null;
  }

  function isSizedDelimiter(text, idx) {
    var i = idx - 1;
    while (i >= 0 && (text.charAt(i) === ' ' || text.charAt(i) === '\t')) i--;
    if (i < 0) return false;
    var name = commandEndingAt(text, i);
    return !!(name && Object.prototype.hasOwnProperty.call(SIZED_DELIM_COMMANDS, name));
  }

  function findBracketDeletion(text, pos, direction) {
    if (pos > 0 && pos < text.length) {
      var left = text.charAt(pos - 1);
      var right = text.charAt(pos);
      if (
        BRACKET_PAIRS[left] === right
        && !isEscapedAt(text, pos - 1)
        && !isInsideLineComment(text, pos - 1)
        && (left === '{' || (!isSizedDelimiter(text, pos - 1) && !isSizedDelimiter(text, pos)))
      ) {
        return { ranges: [{ from: pos - 1, to: pos + 1 }], caret: pos - 1 };
      }
    }

    var idx = direction === 'backward' ? pos - 1 : pos;
    if (idx < 0 || idx >= text.length) return null;
    if (isEscapedAt(text, idx) || isInsideLineComment(text, idx)) return null;

    var ch = text.charAt(idx);
    if (BRACKET_PAIRS[ch]) {
      if (ch !== '{' && isSizedDelimiter(text, idx)) return null;
      var partner = findMatchingCloser(text, idx, ch, BRACKET_PAIRS[ch]);
      if (partner === -1) return null;
      if (ch === '{' && partner > idx + 1 && isCommandArgumentBrace(text, idx)) return null;
      if (ch !== '{' && isSizedDelimiter(text, partner)) return null;
      return {
        ranges: mergeTextRanges({ from: idx, to: idx + 1 }, { from: partner, to: partner + 1 }),
        caret: idx
      };
    }

    if (REVERSE_BRACKETS[ch]) {
      if (ch !== '}' && isSizedDelimiter(text, idx)) return null;
      var openChar = REVERSE_BRACKETS[ch];
      var opener = findMatchingOpener(text, idx, openChar, ch);
      if (opener === -1) return null;
      if (openChar === '{' && opener + 1 < idx && isCommandArgumentBrace(text, opener)) return null;
      if (openChar !== '{' && isSizedDelimiter(text, opener)) return null;
      return {
        ranges: mergeTextRanges({ from: opener, to: opener + 1 }, { from: idx, to: idx + 1 }),
        caret: opener + 1 === idx ? opener : idx - 1
      };
    }
    return null;
  }

  function findPairedDeletion(text, pos, direction) {
    var safePos = Math.max(0, Math.min(Math.floor(pos || 0), text.length));
    return findEnvDeletion(text, safePos, direction)
      || findEscapedParenBracketDeletion(text, safePos, direction)
      || findDollarDeletion(text, safePos, direction)
      || findBracketDeletion(text, safePos, direction);
  }

  root.GabeTeXMathSymbols = {
    categories: CATEGORIES,
    filter: filter,
    isInMathMode: isInMathMode,
    isEscapedAt: isEscapedAt,
    prepareInsertion: prepareInsertion,
    hasPackageImport: hasPackageImport,
    planPackageImport: planPackageImport,
    findBeginAutoClose: findBeginAutoClose,
    findPairedDeletion: findPairedDeletion
  };
})(window);
